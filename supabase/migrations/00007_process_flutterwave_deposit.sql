CREATE OR REPLACE FUNCTION public.process_flutterwave_deposit(
  p_tx_ref text,
  p_amount bigint,
  p_bonus_amount bigint,
  p_secret_hash text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  v_tx record;
  v_wallet record;
begin
  -- Verify the secret hash to prevent unauthorized calls
  if p_secret_hash != 'Y5diV7kyxYlHdKOnmZJYHieuBupO2k8X-FLW' then
    return json_build_object('success', false, 'error', 'Unauthorized');
  end if;

  -- Fetch the pending transaction
  select * into v_tx
  from public.transactions
  where reference = p_tx_ref;

  if not found then
    return json_build_object('success', false, 'error', 'Transaction not found');
  end if;

  if v_tx.status != 'pending' then
    return json_build_object('success', false, 'error', 'Transaction already processed');
  end if;

  -- Fetch the user's wallet
  select * into v_wallet
  from public.wallets
  where user_id = v_tx.user_id;

  if not found then
    -- Create wallet if missing (graceful fallback)
    insert into public.wallets (user_id, balance, bonus_balance)
    values (v_tx.user_id, p_amount, p_bonus_amount);
  else
    -- Update existing wallet
    update public.wallets
    set balance = balance + p_amount,
        bonus_balance = bonus_balance + p_bonus_amount
    where user_id = v_tx.user_id;
  end if;

  -- Update transaction status to completed
  update public.transactions
  set status = 'completed'
  where reference = p_tx_ref;

  -- Insert bonus transaction if applicable
  if p_bonus_amount > 0 then
    insert into public.transactions (user_id, amount, type, reference, status)
    values (v_tx.user_id, p_bonus_amount, 'bonus', 'BONUS-' || p_tx_ref, 'completed');
  end if;

  -- Create notification
  insert into public.notifications (user_id, type, title, body, read)
  values (
    v_tx.user_id,
    'payment',
    'Deposit Successful',
    'Your wallet has been credited with NGN ' || p_amount || ' (Bonus: NGN ' || p_bonus_amount || ').',
    false
  );

  return json_build_object('success', true);
end;
$$;
