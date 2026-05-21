import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest) {
  return request.cookies.get('admin_token')?.value === process.env.ADMIN_API_SECRET
}

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { status } = await request.json()
  const admin = createAdminClient()

  // Fetch the current transaction
  const { data: tx, error: fetchErr } = await admin
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  if (tx.status !== 'Pending') return NextResponse.json({ error: 'Transaction already resolved' }, { status: 400 })

  // Update transaction status
  const { error: updateErr } = await admin
    .from('transactions')
    .update({ status })
    .eq('id', id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400 })

  // Update user balance when approving
  if (status === 'Completed') {
    const { data: profile } = await admin
      .from('profiles')
      .select('balance')
      .eq('id', tx.user_id)
      .single()

    const currentBalance = profile?.balance ?? 0
    const newBalance = tx.type === 'Deposit'
      ? currentBalance + tx.amount
      : Math.max(0, currentBalance - tx.amount)

    await admin.from('profiles').update({ balance: newBalance }).eq('id', tx.user_id)
  }

  return NextResponse.json({ success: true })
}
