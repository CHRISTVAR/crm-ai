'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getContacts, createContact, deleteContact } from '@/modules/contacts/contacts'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  // 🔄 charger contacts
  const loadContacts = async () => {
    const data = await getContacts()
    setContacts(data || [])
  }

  // 🔐 récupérer utilisateur connecté
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.log(error.message)
        return
      }

      setUserId(data.user?.id || null)
    }

    getUser()
    loadContacts()
  }, [])

  // ➕ ajouter contact
  const handleAdd = async () => {
    if (!userId) {
      alert('Utilisateur non connecté')
      return
    }

    try {
      const result = await createContact({
        name,
        email,
        user_id: userId
      })

      console.log('CONTACT OK :', result)

      setName('')
      setEmail('')
      loadContacts()

    } catch (error: any) {
      console.log('ERREUR SUPABASE COMPLETE :', error)
      alert(error.message)
    }
  }

  // ❌ supprimer contact
  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id)
      loadContacts()
    } catch (error: any) {
      console.log('ERREUR DELETE :', error)
      alert(error.message)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Contacts</h1>

      <p style={{ fontSize: 12, color: 'gray' }}>
        User ID: {userId}
      </p>

      {/* FORM */}
      <input
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleAdd}>
        Ajouter
      </button>

      {/* LISTE */}
      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            {c.name} - {c.email}
            <button onClick={() => handleDelete(c.id)}>
              supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}