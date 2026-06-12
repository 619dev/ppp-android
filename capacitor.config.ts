import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.fm619.paperphoneplus',
  appName: 'PaperPhone',
  webDir: 'dist',
  server: {
    // HTTPS scheme is required for WebRTC getUserMedia() and crypto.subtle
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      backgroundColor: '#1a1a2e',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    // Allow mixed content for development (disable in production if needed)
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: false,
  },
}

export default config
