import Pusher from "pusher-js/react-native";

const SOKETI_KEY = process.env.EXPO_PUBLIC_SOKETI_KEY || 'app-key';
const SOKETI_HOST = process.env.EXPO_PUBLIC_SOKETI_HOST || '127.0.0.1';
const SOKETI_PORT = Number(process.env.EXPO_PUBLIC_SOKETI_PORT ?? 6001);

// Determine TLS based on port: 443 = WSS (TLS), anything else = plain WS
const IS_TLS = SOKETI_PORT === 443;

let pusherInstance: Pusher | null = null;

export function getMobilePusher(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher(SOKETI_KEY, {
      wsHost: SOKETI_HOST,
      wsPort: IS_TLS ? undefined : SOKETI_PORT,   // plain WS port (non-TLS only)
      wssPort: IS_TLS ? SOKETI_PORT : undefined,  // WSS port (TLS only)
      forceTLS: IS_TLS,
      enabledTransports: IS_TLS ? ["wss"] : ["ws"],
      disableStats: true,
      cluster: "mt1",
    });
  }
  return pusherInstance;
}
