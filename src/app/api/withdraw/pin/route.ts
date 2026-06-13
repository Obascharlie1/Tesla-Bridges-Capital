import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function hashPin(pin: string) {
  return createHash('sha256').update(pin).digest('hex')
}

// POST /api/withdraw/pin  — set or verify PIN
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, pin } = await request.json()

  if (!pin || !/^\d{4,8}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN must be 4–8 digits' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (action === 'set') {
    const { error } = await admin
      .from('profiles')
      .update({ withdrawal_pin: hashPin(pin) })
      .eq('id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (action === 'verify') {
    const { data, error } = await admin
      .from('profiles')
      .select('withdrawal_pin')
      .eq('id', user.id)
      .single()
    if (error || !data) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!data.withdrawal_pin) return NextResponse.json({ error: 'No PIN set. Please set a withdrawal PIN in your profile.' }, { status: 400 })
    const match = data.withdrawal_pin === hashPin(pin)
    return NextResponse.json({ match })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
