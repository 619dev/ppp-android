# PaperPhonePlus — Android Client

🌐 **其他语言 / Other Languages:** [中文](README.md)

> This repository is the **Android native client** (Capacitor-wrapped) of [PaperPhonePlus](https://github.com/619dev/Paperphone-plus), built from the upstream frontend codebase for Google Play and sideload distribution.

[![Upstream](https://img.shields.io/badge/Upstream-619dev%2FPaperphone--plus-blue?logo=github)](https://github.com/619dev/Paperphone-plus)
[![React](https://img.shields.io/badge/React-19-blue)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](#)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-green)](#)
[![Version](https://img.shields.io/badge/Version-2.4.4-orange)](package.json)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)

[![Google Play](https://img.shields.io/badge/Google%20Play-Download-green?logo=google-play)](https://play.google.com/store/apps/details?id=com.fm619.paperphoneplus)

---

## 📖 Overview

PaperPhonePlus is a WeChat-style end-to-end encrypted instant messaging application. This repository contains the Android native client, which uses [Capacitor](https://capacitorjs.com/) to package the React + TypeScript frontend into an Android APK/AAB.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔐 End-to-End Encryption | Stateless ECDH + XSalsa20-Poly1305, per-message ephemeral keys, forward secrecy |
| 🗝️ Secure Local Keys | Identity and group Sender Keys are protected by Android Keystore; chat caches use a device-bound AES-256-GCM key |
| 📹 Video/Voice Calls | LiveKit SFU for both direct and group calls (up to 100 participants), with discussion and lecture modes |
| 🎙️ Real-time Voice Changer | Voice messages & calls support 3 modes (0.8x / 1.0x / 1.2x) |
| 📱 Session Persistence | Keeps users signed in through network loss, ordinary authorization failures, and server URL changes; signs out only on an explicit server revocation |
| 📴 Offline Access | Account-isolated caching for contacts, groups, chats, Moments, Timeline, and media keeps previously loaded content available offline |
| 👥 Group Chat | Up to 2,000 members, encrypted & unencrypted modes |
| 💬 Rich Messaging | Text, images, video, files, voice messages, message replies, emoji panel, Telegram sticker packs, read receipts |
| 🌐 Moments | Post updates (text + images/video), likes, comments, tag-based visibility |
| 📰 Timeline | Xiaohongshu-style public feed with waterfall layout, anonymous posting |
| 🔔 Push Notifications | FCM + OneSignal + ntfy multi-channel push |
| 🌐 Multi-language | Chinese, English, Japanese, Korean, French, German, Russian, Spanish |
| 🔑 Two-Factor Auth | Google Authenticator-compatible TOTP with 8 recovery codes |
| 📷 QR Code Scanning | Scan to add friends or join groups |

### What's New in v2.4.4

- Fixed the locked extra-encryption dialog so it requests the unlock password instead of asking users to set one, across all eight languages.

- Fixed a security issue that allowed extra text-appearance encryption to be disabled without password verification; the correct extra password must now be re-entered even while unlocked.
- Text appearance now hides protocol metadata and optimistic caches no longer retain original message bodies.
- Extra message-history encryption moved to Profile > Message privacy and applies globally to all chats.

- Encrypted sends now fail closed instead of falling back to plaintext, and each message reports its actual `PQ v2`, `X25519 ↓`, or `SK vN` protocol.
- Added an optional chat-history password, eight presentation codecs, and automatic locking 5/15/30/60 minutes after leaving the foreground.
- Locked or incorrectly unlocked histories show presentation ciphertext only; identity private keys and Sender Keys are protected by Android Keystore, with complete UI copy in all eight languages.

#### v2.3.9

- Refreshes the friends list and shows the correct message when the server confirms the users are already friends, matching the repaired friend-request API.

#### v2.3.8

- Fixed the unresponsive back button after the QR scanner starts the camera; closing now stops and releases the camera immediately.
- Fixed duplicate friend requests to existing friends corrupting the friendship; search results now clearly show “Already friends.”

- Added encryption at rest for local chat history using a device-bound Android Keystore key and AES-256-GCM, with ciphertext stored in a dedicated IndexedDB database.
- Moved identity private keys and group Sender Keys into secure system-backed storage that cannot be restored onto another device with an app backup.
- Chat plaintext now remains in memory only; decrypted fields are stripped before persistence, including optimistic outgoing private messages.
- Added one-time migration and removal of legacy plaintext keys and chat caches from localStorage, sessionStorage, and IndexedDB, plus cleanup of the former unencrypted media cache.
- Encrypted caches are isolated per account and authenticated against tampering; invalid data is discarded without falling back to plaintext storage.

#### v2.3.3

- Keeps the screen awake while recording voice messages, preventing the recording UI from becoming unresponsive after automatic locking.
- Limits voice messages to 120 seconds and stops automatically at the limit; processed voice effects are also capped at 120 seconds.
- Releases the recorder, timers, and microphone when leaving a chat to improve recording stability.

- Added call sleep prevention: the screen stays awake during direct and group voice/video calls.
- Covers incoming, outgoing, connecting, and connected states, then restores the system screen-timeout policy when the call ends or fails.
- Uses Android's native window keep-screen-on flag without requesting an additional background wake-lock permission.
- Overhauled session persistence with automatic short-lived access-token refresh and seamless upgrades for legacy sessions.
- Added authenticated WebSocket readiness, heartbeat timeout detection, exponential-backoff reconnects, and recovery after network changes or app resume.
- Added catch-up message synchronization and a durable local outbox so queued messages resume after reconnect and reconcile by client message ID.
- Preserved local accounts and cached data while offline; automatic sign-out now occurs only after explicit server-side session revocation.
- Retained the v2.3.0 Google Pixel lineup WindowInsets and safe-area adaptations.
- Updated the app version to 2.3.2.

---

## 🏗️ Architecture

```
ppp-android/
├── android/                  # Capacitor Android native project
├── src/                      # React + TypeScript frontend source
│   ├── App.tsx               # Router + auth guard
│   ├── index.css             # Design system (dark/light, glassmorphism)
│   ├── main.tsx              # React entry point
│   ├── api/                  # HTTP client + WebSocket client
│   ├── components/           # UI components (TabBar, call overlay, QR code, etc.)
│   ├── contexts/             # React contexts
│   ├── crypto/               # Encryption modules
│   │   ├── ratchet.ts        # ECDH + XSalsa20-Poly1305 encryption
│   │   ├── keystore.ts       # Android Keystore-backed private key persistence
│   │   └── groupCrypto.ts    # Group encryption (Sender Key protocol)
│   ├── hooks/                # Custom hooks
│   │   └── useGroupCall.ts   # LiveKit group meetings and host controls
│   ├── i18n/                 # Internationalization
│   ├── pages/                # Page components
│   ├── store/                # Zustand state management
│   └── utils/                # Utility functions
│       ├── messagePayload.ts # Compatible message body and reply metadata encoding
│       ├── offlineCache.ts   # Account-isolated offline data and media cache
│       ├── stickerCache.ts   # Persistent Telegram sticker cache
│       └── session.ts        # Session termination detection and safe sign-out
├── capacitor.config.ts       # Capacitor configuration
├── vite.config.ts            # Vite build configuration
├── package.json              # Dependency management
└── google-services.json      # Firebase config (FCM push)
```

### Tech Stack

- **Frontend Framework**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 6
- **State Management**: Zustand 5
- **Native Bridge**: Capacitor 8 (Android)
- **Crypto Library**: libsodium-wrappers-sumo (WebAssembly, Curve25519 / XSalsa20-Poly1305)
- **Post-Quantum Crypto**: crystals-kyber-js (CRYSTALS-Kyber key encapsulation)
- **Video Calls**: LiveKit SFU (direct and group calls)
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **UI Icons**: Lucide React
- **Animations**: Lottie Web
- **QR Code**: qrcode + jsqr

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Android Studio](https://developer.android.com/studio) + Android SDK
- JDK 17+

### Installation & Build

```bash
# 1. Clone the repository
git clone <repo-url> && cd ppp-android

# 2. Install dependencies
npm install

# 3. Build the frontend
npm run build

# 4. Sync to Android project
npx cap sync android

# 5. Open in Android Studio
npx cap open android
```

### Development Mode

```bash
# Start the frontend dev server
npm run dev

# In another terminal, run Android with live reload
npx cap run android --livereload --external
```

> **Note**: In development mode, you need to configure the backend server address. You can manually enter the backend URL on the login page, e.g., `https://your-server.com`.

---

## 🔧 Configuration

### Capacitor Configuration

Core settings are in [capacitor.config.ts](capacitor.config.ts):

| Setting | Value | Description |
|---------|-------|-------------|
| `appId` | `com.fm619.paperphoneplus` | Android application package name |
| `appName` | `PaperPhonePlus` | App display name |
| `webDir` | `dist` | Frontend build output directory |
| `androidScheme` | `https` | Required for WebRTC and crypto APIs |

### Firebase Push Configuration

1. Create a project in [Firebase Console](https://console.firebase.google.com) and add an Android app
2. Download `google-services.json` and place it in the project root
3. Configure FCM credentials on the backend server (see [upstream docs](https://github.com/619dev/Paperphone-plus#配置-fcmcapacitor-原生-android-app))

---

## 📦 Building for Release

### Build Release APK/AAB

```bash
# Build the frontend
npm run build

# Sync to Android project
npx cap sync android

# In Android Studio, build a signed bundle
# Build → Generate Signed Bundle / APK
```

### Signing Configuration

The project includes a release signing keystore `paperphone-release.keystore` for Google Play signed distribution.

---

## 🔗 Related Projects

| Project | Description |
|---------|-------------|
| [Paperphone-plus](https://github.com/619dev/Paperphone-plus) | Upstream main repository (frontend + backend) |
| [ppp-win](https://github.com/619dev/ppp-win) | Windows desktop client |
| [ppp-mac](https://github.com/619dev/ppp-mac) | Mac desktop client |

---

## 🔒 Security Model

```
On Registration:
  Device locally generates IK (Identity Key) + SPK (Signed Pre-Key) + 20x OPK (One-time Pre-Keys)
  Public keys uploaded to server; private keys persist in 4 layers, never leaving the device

On Sending Messages:
  Sender downloads recipient's IK public key
  Generates ephemeral ECDH key pair (unique per message)
  X25519 ECDH → shared secret → XSalsa20-Poly1305 encryption
  Ephemeral public key attached to message header; recipient destroys it after decryption

What the Server Sees:
  ✅ Ciphertext blob + routing metadata (sender/recipient UUID)
  ❌ Plaintext / private keys / ephemeral keys / call content
```

---

## 📄 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE), consistent with the upstream repository [619dev/Paperphone-plus](https://github.com/619dev/Paperphone-plus).

In summary:
- ✅ Free to deploy and use by individuals and enterprises
- ✅ Modification is permitted
- ⚠️ If you provide a modified version as a network service, you must release the modified source code
- ⚠️ Derivative works must use the same license (AGPL-3.0)
- ⚠️ Original copyright notices and license information must be preserved

See the full license text in the [LICENSE](LICENSE) file.

---

## 🤝 Contributing

Contributions via Issues and Pull Requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📬 Contact

- Telegram Group: https://t.me/+vHJtvWJY_gEyMTUx
- Upstream Issues: https://github.com/619dev/Paperphone-plus/issues
