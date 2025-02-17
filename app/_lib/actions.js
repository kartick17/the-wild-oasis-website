'use server'

import { revalidatePath } from 'next/cache'
import { auth, signIn, signOut } from './auth'
import { supabase } from './supabase'

export async function signInAction() {
  await signIn('google', {
    redirectTo: '/account',
  })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}

export async function updateGuest(fromData) {
  const { user: guest } = await auth()

  if (!guest) throw new Error('You must be signed in to update your profile')

  const nationalID = fromData.get('nationalID')
  const [nationality, countryFlag] = fromData.get('nationality').split('%')

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Invalid National ID')

  const updatedData = {
    nationalID,
    nationality,
    countryFlag,
  }

  const { error } = await supabase
    .from('guests')
    .update(updatedData)
    .eq('id', guest.guestId)

  if (error) throw new Error('Guest could not be updated')

  revalidatePath('/account/profile')
}
