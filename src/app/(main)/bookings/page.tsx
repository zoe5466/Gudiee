'use client';

import { redirect } from 'next/navigation';

export default function BookingsPage() {
  // 直接重定向到 my-bookings
  redirect('/my-bookings');
}