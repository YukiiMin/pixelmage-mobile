import { useMutation } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'

interface CheckoutTokenResponse {
  data: {
    checkoutToken: string
  }
  message: string
}

/**
 * Issues a short-lived (5 min, one-use) checkout token from the Backend.
 * The Mobile App sends this token in the URL to the Web checkout page
 * instead of the raw JWT — prevents token exposure in browser/server logs.
 *
 * Usage:
 *   const { mutateAsync: getCheckoutToken, isPending } = useCheckoutToken()
 *   const ct = await getCheckoutToken()
 *   Linking.openURL(`${baseUrl}/checkout/${packId}?ct=${encodeURIComponent(ct)}`)
 */
export function useCheckoutToken() {
  return useMutation({
    mutationFn: async (): Promise<string> => {
      const res = await client.post<CheckoutTokenResponse>(EP.AUTH_CHECKOUT_TOKEN)
      const token = res?.data?.checkoutToken
      if (!token) throw new Error('Backend không trả về checkout token')
      return token
    },
  })
}
