# Technology Stack

## Frontend Framework
- **React Native** with TypeScript for mobile development
- **Expo** or **React Native CLI** for project setup and development
- **React Navigation** for mobile navigation patterns

## Package Manager & Runtime
- **Bun** as the package manager and runtime
- **ESM modules** (type: "module" in package.json)
- **Bun compatibility** with React Native and Amplify libraries

## UI Components
- **React Native UI library** (NativeBase, React Native Elements, or Tamagui)
- **React Native Vector Icons** for mobile iconography
- **Custom mobile components** following React Native patterns
- **React Native StyleSheet** for component styling
- **Platform-specific styling** for iOS and Android

## Data Layer
- **AWS Amplify GraphQL** for database operations and state management
- **AWS AppSync** for real-time data synchronization
- **Amplify DataStore** for offline-first functionality
- **GraphQL operations** for data queries and mutations
- **React Hook Form** with **Zod** validation for mobile forms

## Backend Services
- **AWS Amplify** for backend infrastructure
- **Amazon Cognito** for authentication and user management
- **AWS Lambda** for custom business logic
- **Amazon S3** for file storage and media assets
- **Amazon DynamoDB** or **RDS** for database

## State Management
- **React Context** for global state (CoachContext)
- **Amplify hooks** for server state management
- **Local state** with useState for component-level state
- **AsyncStorage** for local data persistence

## Styling & Theming
- **React Native StyleSheet** for component styling
- **Dynamic theming** via React Native theme providers
- **Coach-specific color schemes** applied at runtime
- **Responsive design** with React Native Dimensions and screen size detection

## Development Tools
- **TypeScript 5.5.3** for type safety
- **ESLint** with React Native specific rules
- **Metro** bundler for React Native
- **Flipper** for debugging (optional)

## Mobile Development
- **iOS** and **Android** cross-platform support
- **Push notifications** via Amplify Push Notifications
- **Offline capabilities** with Amplify DataStore
- **App Store** and **Google Play Store** deployment

## Common Commands
```bash
# Install dependencies
bun install

# Start React Native development server
bun run start

# Run on iOS simulator
bun run ios

# Run on Android emulator
bun run android

# Build for production
bun run build

# Run linting
bun run lint
```

## Database
- **AWS Amplify GraphQL schema** with auto-generated resolvers
- **Real-time subscriptions** for collaborative features
- **Offline sync** with conflict resolution
- **Coach system** with personality configurations and user interactions