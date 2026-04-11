import { supabase } from '@/lib/supabase'

// 🔍 GET CONTACTS
export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')

  if (error) {
    console.log("SUPABASE ERROR:", error)
    throw error
  }

  return data
}

// ➕ CREATE CONTACT
export const createContact = async (contact: {
  name: string
  email: string
  user_id: string
}) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()

  if (error) {
    console.log("SUPABASE ERROR:", error)
    throw error
  }

  return data
}

// ❌ DELETE CONTACT
export const deleteContact = async (id: string) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.log("SUPABASE ERROR:", error)
    throw error
  }
}