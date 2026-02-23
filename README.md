# Ferify Mobile App

The Ferify mobile application is a powerful, community-driven tool built with React Native and Expo. It allows users to browse transport routes, contribute verified fare information, and stay updated with real-time notifications.

## Key Features

- **Real-time Notifications**: Integrated via Socket.io for instant updates on fare verifications and system status.
- **Fare Contribution Flow**: Step-by-step UI for users to suggest and verify transport fares.
- **Smart Route Selection**: Interactive route selection with community-backed fare data.
- **Account Management**: Comprehensive user profiles, including contribution history and achievements.
- **Leaderboards & Achievements**: Gamified experience to encourage community participation.
- **Universal Search**: Unified search for destinations and transport options.

## Technology Stack

- **Framework**: [Expo](https://expo.dev) / React Native
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction) (File-based)
- **State Management**: React Context API
- **Real-time**: [Socket.io-client](https://socket.io/docs/v4/client-api/)
- **Networking**: Axios
- **Icons**: Ionicons (@expo/vector-icons)

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

1. Clone the repository and navigate to the mobile app directory:
   ```bash
   cd ferify-mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root of the mobile app directory and add your server URL:
   ```env
   EXPO_PUBLIC_SERVER_URL=http://your-server-ip:5000
   ```

### Running the App

Start the development server:
```bash
npm start
```

- Press **`a`** for Android
- Press **`i`** for iOS
- Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android) to run on a physical device.

## Project Structure

- `app/`: Contains the main screens and file-based routing logic.
- `components/`: Reusable UI components.
- `contexts/`: Global state providers (Auth, Notifications, etc.).
- `services/`: API configuration and service layers.
- `assets/`: Images, animations, and sound files.
- `utils/`: Helper functions and constants.

## Contributing

Please ensure you follow the coding standards and styling guidelines established in the project. Run `npm run lint` before committing your changes.
