import { useEffect, useState } from 'react'
import { secureStore } from '@/api/secureStore'

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    secureStore.get('userRole').then((r) => {
      setRole(r)
      setLoading(false)
    })
  }, [])

  return {
    role,
    loading,
    isStaff: role === 'STAFF' || role === 'ADMIN',
    isCustomer: role === 'CUSTOMER',
  }
}
