import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest) {
  return request.cookies.get('admin_token')?.value === process.env.ADMIN_API_SECRET
}

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { pin } = await request.json()

  if (!pin || !/^\d{4,6}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN must be 4–6 digits' }, { status: 400 })
  }

  const hash = createHash('sha256').update(pin).digest('hex')
  const admin = createAdminClient()

  const { error } = await admin
    .from('profiles')
    .update({ withdrawal_pin: hash })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
