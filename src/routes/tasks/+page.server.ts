import { supabase } from '$lib/supabase'
import { fail } from '@sveltejs/kit'

export const load = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { tasks: [] }
  }

  return { tasks: data }
}

export const actions = {
  create: async ({ request }: { request: Request }) => {
    const formData = await request.formData()

    const task = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      due_date: formData.get('due_date'),
      status: 'Pending'
    }

    const { error } = await supabase.from('tasks').insert(task)

    if (error) {
      return fail(400, { error: error.message })
    }

    return { success: true }
  },

  delete: async ({ request }: { request: Request }) => {
    const formData = await request.formData()
    const id = formData.get('id')

    await supabase.from('tasks').delete().eq('id', id)

    return { success: true }
  }
}
