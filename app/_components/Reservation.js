import React from 'react'
import DateSelector from './DateSelector'
import ReservationForm from './ReservationForm'
import { getBookedDatesByCabinId, getSettings } from '../_lib/data-service'
import { auth } from '../_lib/auth'
import LoginMessage from './LoginMessage'

export default async function Reservation({ cabin }) {
  const session = await auth()
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ])

  return (
    <div className='grid grid-cols-5 border border-primary-800 min-h-[400px]'>
      <div className='col-span-3'>
        <DateSelector
          cabin={cabin}
          settings={settings}
          bookedDates={bookedDates}
        />
      </div>
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  )
}
