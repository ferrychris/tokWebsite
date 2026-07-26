-- Wallet funding is now charged in the currency the user sees (USD outside
-- Nigeria, NGN inside), while wallet balances stay denominated in NGN.
--
-- `amount` remains the NGN value credited to the wallet. The two new columns
-- record what was actually charged at the gateway, so verification can prove
-- the payment matches what we asked for.
alter table public.transactions
	add column if not exists charge_amount numeric(14, 2),
	add column if not exists charge_currency text;

-- Existing deposits were all charged in Naira at face value.
update public.transactions
set charge_amount = amount, charge_currency = 'NGN'
where charge_currency is null;

-- Harden the deposit function: credit the NGN amount recorded on the
-- transaction rather than the amount handed in by the caller. Previously a
-- USD charge of 10.00 would have credited 10 Naira instead of the ~16,000 the
-- user actually paid for. p_amount is kept in the signature for compatibility
-- but is deliberately no longer used to move money.
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
  v_credit bigint;
begin
  if p_secret_hash != 'Y5diV7kyxYlHdKOnmZJYHieuBupO2k8X-FLW' then
    return json_build_object('success', false, 'error', 'Unauthorized');
  end if;

  select * into v_tx
  from public.transactions
  where reference = p_tx_ref;

  if not found then
    return json_build_object('success', false, 'error', 'Transaction not found');
  end if;

  if v_tx.status != 'pending' then
    return json_build_object('success', false, 'error', 'Transaction already processed');
  end if;

  -- Source of truth: the NGN amount recorded when the deposit was initialised.
  v_credit := v_tx.amount;

  select * into v_wallet
  from public.wallets
  where user_id = v_tx.user_id;

  if not found then
    insert into public.wallets (user_id, balance, bonus_balance)
    values (v_tx.user_id, v_credit, p_bonus_amount);
  else
    update public.wallets
    set balance = balance + v_credit,
        bonus_balance = bonus_balance + p_bonus_amount
    where user_id = v_tx.user_id;
  end if;

  update public.transactions
  set status = 'completed'
  where reference = p_tx_ref;

  if p_bonus_amount > 0 then
    insert into public.transactions (user_id, amount, type, reference, status, charge_amount, charge_currency)
    values (v_tx.user_id, p_bonus_amount, 'bonus', 'BONUS-' || p_tx_ref, 'completed', null, null);
  end if;

  -- Preserved from 00007, now reporting the credited NGN amount.
  insert into public.notifications (user_id, type, title, body, read)
  values (
    v_tx.user_id,
    'payment',
    'Deposit Successful',
    'Your wallet has been credited with NGN ' || v_credit || ' (Bonus: NGN ' || p_bonus_amount || ').',
    false
  );

  return json_build_object('success', true, 'amount', v_credit, 'bonus_amount', p_bonus_amount);
end;
$$;
