# Zuno:// - Personalized Learning Platform

Zuno:// is an intelligent, adaptive learning platform that combines personalized AI coaching with engaging educational content. The platform features four distinct learning modalities represented by animal coaches, each with unique visual themes and pedagogical approaches.

## Features

- **Assessment-Driven Learning**: Focus on what you don't know through continuous assessment and adaptive content delivery
- **Four AI Coaches**: Choose from Elia (methodical), Skippy (dynamic), Lupa (collaborative), or Polpo (adaptive) learning styles
- **Personalized Experience**: Dynamic theming and content adaptation based on your chosen coach
- **Progress Tracking**: Comprehensive analytics, XP system, streaks, and achievement badges
- **Collaborative Learning**: Social features for group study and peer interaction (Lupa mode)
- **Professional Design**: Colorful yet sophisticated interface designed for adult learners

## Technology Stack

- **Frontend**: React 18.3.1 with TypeScript, Vite, and Tailwind CSS
- **Backend**: AWS Amplify with AppSync GraphQL and DynamoDB
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Package Manager**: Bun for fast development and builds
- **Authentication**: AWS Cognito (ready for implementation)
- **Real-time Features**: GraphQL subscriptions via AWS AppSync

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [AWS Amplify CLI](https://docs.amplify.aws/cli/start/install/)
- AWS Account (for backend services)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zuno-learning-app
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Initialize Amplify (if not already done):
   ```bash
   amplify init
   ```

4. Deploy the backend:
   ```bash
   amplify push
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

### Development Commands

```bash
# Development
bun run dev                 # Start development server
bun run build              # Build for production
bun run lint               # Run ESLint

# Amplify Backend
bun run amplify:status     # Check backend status
bun run amplify:push       # Deploy backend changes
bun run amplify:mock       # Start mock services
bun run amplify:publish    # Deploy full-stack app

# Data Management
bun run src/scripts/seedAmplifyData.ts  # Seed sample data
```

## Architecture

Zuno:// follows a serverless architecture using AWS Amplify:

- **Frontend**: React SPA with TypeScript and Tailwind CSS
- **API**: AWS AppSync GraphQL for real-time features
- **Database**: DynamoDB with optimized access patterns
- **Authentication**: AWS Cognito for user management
- **Storage**: Amazon S3 for media assets
- **Hosting**: AWS Amplify Hosting with CI/CD

## Coach System

The platform features four AI coaches, each with distinct personalities:

- **Elia (Elephant)**: Deep, methodical learning with extended explanations
- **Skippy (Squirrel)**: Quick, exploratory learning with varied content
- **Lupa (Wolf)**: Collaborative learning with social features
- **Polpo (Octopus)**: Adaptive hybrid approach that combines multiple strategies

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the Zuno:// team or create an issue in this repository.

---

**Zuno:// - Intelligenza Adattiva per l'Apprendimento Professionale**