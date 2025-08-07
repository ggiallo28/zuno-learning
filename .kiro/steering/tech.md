# Technology Stack

## Frontend Framework
- **React 18.3.1** with TypeScript for web development
- **Vite** for fast development and build tooling
- **React Router** for client-side routing and navigation

## Package Manager & Runtime
- **Bun** as the package manager and runtime
- **ESM modules** (type: "module" in package.json)
- **Bun compatibility** with React and web libraries

## UI Components
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Custom components** following shadcn/ui patterns
- **Responsive design** with Tailwind breakpoints

## Data Layer
- **AWS Amplify** for full-stack serverless development
- **AWS AppSync** for GraphQL API with real-time subscriptions
- **AWS API Gateway** for REST API endpoints
- **DynamoDB** NoSQL database for scalable data storage
- **React Hook Form** with **Zod** validation for forms
- **Amplify DataStore** for offline-first functionality and local state management

## Backend Services
- **AWS Amplify** for serverless backend infrastructure
- **AWS AppSync** for managed GraphQL API
- **AWS API Gateway** for REST API with Lambda integration
- **AWS DynamoDB** with auto-generated resolvers
- **AWS Lambda** functions for custom business logic resolvers
- **Amazon S3** for file storage and media assets
- **AWS Cognito** for authentication and user management

## State Management
- **React Context** for global state (CoachContext)
- **Amplify DataStore** for offline-first state management
- **GraphQL hooks** for real-time data operations
- **REST API hooks** for traditional CRUD operations
- **Local state** with useState for component-level state
- **Amplify DataStore** for client-side data persistence and sync

## Styling & Theming
- **Tailwind CSS** for component styling
- **CSS custom properties** for dynamic theming
- **Coach-specific color schemes** applied at runtime
- **Responsive design** with Tailwind responsive utilities

## Development Tools
- **TypeScript 5.5.3** for type safety
- **ESLint** with React and TypeScript rules
- **Vite** for fast development and hot module replacement
- **PostCSS** and **Autoprefixer** for CSS processing

## Web Development
- **Progressive Web App** capabilities
- **Responsive design** for desktop and mobile browsers
- **Web deployment** to hosting platforms
- **Browser compatibility** across modern browsers

## Common Commands
```bash
# Install dependencies
bun install

# Initialize Amplify project
amplify init

# Add Amplify services
amplify add api    # Choose GraphQL for AppSync
amplify add api    # Choose REST for API Gateway
amplify add auth
amplify add storage

# Start development server
bun run dev

# Deploy Amplify backend
amplify push

# Build for production
bun run build

# Deploy to Amplify hosting
amplify publish

# Run linting
bun run lint
```

## Database
- **AWS DynamoDB** with NoSQL document storage
- **Amplify GraphQL schema** with auto-generated resolvers
- **GraphQL operations** via AppSync for real-time features
- **REST API operations** via API Gateway for traditional CRUD
- **Coach system** with personality configurations and user interactions
- **Global Secondary Indexes** for efficient querying
- **Real-time subscriptions** for collaborative features