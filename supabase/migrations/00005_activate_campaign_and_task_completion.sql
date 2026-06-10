-- Create or update handle_task_completion trigger function
CREATE OR REPLACE FUNCTION public.handle_task_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_reward bigint;
  v_delivered int;
  v_requested int;
begin
  -- Calculate reward: 50% of price paid per viewer
  select COALESCE((cost / NULLIF(viewers_requested, 0)) / 2, 50), COALESCE(viewers_requested, 1)
  into v_reward, v_requested
  from public.campaigns
  where id = NEW.campaign_id;

  -- Credit worker's wallet
  update public.wallets
  set balance = balance + v_reward
  where user_id = NEW.worker_id;

  -- Log the transaction
  insert into public.transactions (user_id, amount, type, reference, status)
  values (NEW.worker_id, v_reward, 'bonus', 'Task Completion: ' || NEW.campaign_id, 'completed');

  -- Update viewers_delivered on campaign
  update public.campaigns
  set viewers_delivered = COALESCE(viewers_delivered, 0) + 1
  where id = NEW.campaign_id
  returning viewers_delivered into v_delivered;

  -- Check if campaign is now completed
  if v_delivered >= v_requested then
    update public.campaigns
    set status = 'completed'
    where id = NEW.campaign_id;
  end if;

  return NEW;
end;
$function$;

-- Create activate_campaign RPC function
CREATE OR REPLACE FUNCTION public.activate_campaign(p_campaign_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_campaign record;
  v_wallet record;
  v_cost bigint;
  v_creator_id uuid;
  v_total_balance bigint;
  v_deduct_bonus bigint;
  v_deduct_balance bigint;
begin
  -- Fetch the campaign details
  select * into v_campaign
  from public.campaigns
  where id = p_campaign_id;

  if not found then
    return json_build_object('success', false, 'error', 'Campaign not found');
  end if;

  if v_campaign.status != 'draft' and v_campaign.status != 'pending' then
    return json_build_object('success', false, 'error', 'Campaign is already active or completed');
  end if;

  v_cost := v_campaign.cost;
  v_creator_id := v_campaign.user_id;

  -- Fetch the creator's wallet
  select * into v_wallet
  from public.wallets
  where user_id = v_creator_id;

  if not found then
    return json_build_object('success', false, 'error', 'Wallet not found');
  end if;

  v_total_balance := v_wallet.balance + v_wallet.bonus_balance;
  if v_total_balance < v_cost then
    return json_build_object('success', false, 'error', 'Insufficient balance. Please fund your wallet.');
  end if;

  -- Determine how much to deduct from bonus and main balance
  if v_wallet.bonus_balance >= v_cost then
    v_deduct_bonus := v_cost;
    v_deduct_balance := 0;
  else
    v_deduct_bonus := v_wallet.bonus_balance;
    v_deduct_balance := v_cost - v_deduct_bonus;
  end if;

  -- Update creator's wallet
  update public.wallets
  set balance = balance - v_deduct_balance,
      bonus_balance = bonus_balance - v_deduct_bonus
  where user_id = v_creator_id;

  -- Log the transaction for the creator
  insert into public.transactions (user_id, amount, type, reference, status)
  values (v_creator_id, v_cost, 'campaign_spend', 'Campaign Activation: ' || p_campaign_id, 'completed');

  -- Update campaign status to active
  update public.campaigns
  set status = 'active'
  where id = p_campaign_id;

  -- Insert notification for the creator
  insert into public.notifications (user_id, type, title, body, read)
  values (v_creator_id, 'campaign_update', 'Campaign Activated', 'Your campaign is now live — viewers will start joining shortly.', false);

  return json_build_object('success', true);
end;
$function$;
