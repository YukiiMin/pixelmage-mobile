import { Redirect } from 'expo-router'

export default function TabIndex() {
  // @ts-expect-error: Redirect to directory-based route /(tabs)/home
  return <Redirect href="/(tabs)/home" />
}
