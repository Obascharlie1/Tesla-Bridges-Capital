import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — user fetches their conversation
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Mark all admin messages as read when user opens inbox
  await supabase.from('messages').update({ read: true }).eq('user_id', user.id).eq('sender', 'admin').eq('read', false)

  return NextResponse.json({ data: data ?? [] })
}

// POST — user sends a reply
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('messages')
    .insert({ user_id: user.id, sender: 'user', content: content.trim(), read: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ data })
}
