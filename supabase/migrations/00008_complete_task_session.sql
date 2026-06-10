-- Drop the policy that allows workers to update their campaign assignments directly
DROP POLICY IF EXISTS "Allow update for worker or admin" ON public.campaign_assignments;

-- Create a new policy that restricts updates to admins only
CREATE POLICY "Allow update for admin only" 
ON public.campaign_assignments 
FOR UPDATE 
TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- Create the secure task session completion function
CREATE OR REPLACE FUNCTION public.complete_task_session(p_session_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_session record;
  v_campaign record;
  v_assignment record;
  v_heartbeat_count int;
  v_expected_heartbeats int;
  v_actual_duration_seconds int;
  v_required_seconds int;
begin
  -- 1. Fetch the task session
  select * into v_session
  from public.task_sessions
  where id = p_session_id;

  if not found then
    return json_build_object('success', false, 'error', 'Session not found');
  end if;

  -- 2. Verify that the caller is the worker who owns the session
  if v_session.worker_id != auth.uid() then
    return json_build_object('success', false, 'error', 'Unauthorized');
  end if;

  if v_session.status != 'active' then
    return json_build_object('success', false, 'error', 'Session is already completed or inactive');
  end if;

  -- 3. Fetch the campaign
  select * into v_campaign
  from public.campaigns
  where id = v_session.task_id;

  if not found then
    return json_build_object('success', false, 'error', 'Campaign not found');
  end if;

  -- 4. Fetch the assignment
  select * into v_assignment
  from public.campaign_assignments
  where campaign_id = v_session.task_id and worker_id = v_session.worker_id;

  if not found then
    return json_build_object('success', false, 'error', 'Campaign assignment not found');
  end if;

  if v_assignment.status = 'completed' then
    return json_build_object('success', false, 'error', 'Assignment is already completed');
  end if;

  -- 5. Calculate and verify heartbeats
  select count(distinct created_at) into v_heartbeat_count
  from public.session_heartbeats
  where session_id = p_session_id;

  select coalesce(
    extract(epoch from (max(created_at) - min(created_at))),
    0
  ) into v_actual_duration_seconds
  from public.session_heartbeats
  where session_id = p_session_id;

  -- Each campaign duration is in minutes.
  v_required_seconds := v_campaign.duration * 60;
  
  -- We expect at least 3 heartbeats per minute of required duration (one every 20 seconds) as a safety margin.
  v_expected_heartbeats := v_campaign.duration * 3;

  -- Validate watch time: must have minimum heartbeat count and elapsed time (with 80% grace threshold)
  if v_heartbeat_count < v_expected_heartbeats or v_actual_duration_seconds < (v_required_seconds * 0.8) then
    return json_build_object(
      'success', false, 
      'error', 'Insufficient watch duration. Verified watch time: ' || round(v_actual_duration_seconds / 60.0, 1) || ' minutes. Required: ' || v_campaign.duration || ' minutes.'
    );
  end if;

  -- 6. Update task session
  update public.task_sessions
  set status = 'completed',
      ended_at = now(),
      duration = v_actual_duration_seconds
  where id = p_session_id;

  -- 7. Update campaign assignment status to completed
  -- This triggers public.handle_task_completion() to credit the worker
  update public.campaign_assignments
  set status = 'completed',
      completed_at = now()
  where id = v_assignment.id;

  return json_build_object('success', true);
end;
$$;
