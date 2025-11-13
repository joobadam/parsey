import { auth } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    let query = supabaseServer
      .from('transactions')
      .select('*, categories(id, name, icon)')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = new Date(year, monthNum - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0]
      query = query.gte('date', startDate).lte('date', endDate)
    }
    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const {
      category_id,
      type,
      amount,
      description,
      merchant,
      date,
      ai_categorized,
      ai_confidence,
    } = body
    if (!category_id || !type || !amount || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const { data, error } = await supabaseServer
      .from('transactions')
      .insert([
        {
          user_id: session.user.id,
          category_id,
          type,
          amount,
          description,
          merchant,
          date,
          ai_categorized: ai_categorized || false,
          ai_confidence: ai_confidence || null,
        },
      ])
      .select()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


