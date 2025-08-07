---
inclusion: always
---

# Project Structure & Architecture Guidelines

## File Organization Rules

### GraphQL (`/src/graphql/`)
- **Purpose**: GraphQL operations for Amplify AppSync (real-time features, subscriptions)
- **Pattern**: Separate files for queries, mutations, and subscriptions
- **Naming**: Descriptive GraphQL operations (listCourses, createUser, updateUserCoach)
- **When creating new operations**: Follow Amplify GraphQL patterns, use generated types, handle errors appropriately

### API (`/src/api/`)
- **Purpose**: REST API operations for AWS API Gateway (traditional CRUD, file uploads)
- **Pattern**: One service per domain (userService, courseService, assessmentService)
- **Naming**: RESTful endpoints (/users, /courses, /assessments)
- **When creating new APIs**: Follow REST conventions, use proper HTTP methods, handle errors appropriately

### Components (`/components/`)
- **Page-level components**: Direct children of `/components/` (CourseCatalog, UserProfile, etc.)
- **UI primitives**: Located in `/components/ui/` following shadcn/ui patterns
- **Pattern**: Named exports for UI components, composition over inheritance
- **When creating components**: Use TypeScript, follow existing naming conventions, implement proper props interfaces

### Context (`/contexts/`)
- **Global state management**: Use React Context for app-wide state
- **CoachContext**: Manages coach selection, theming, and personality data
- **Pattern**: Provide both context and custom hook (useCoach)

### Types (`/types/`)
- **Central type definitions**: All TypeScript interfaces in `/types/index.ts`
- **Pattern**: Export interfaces for User, Course, Lesson, Coach, Progress entities
- **When adding types**: Keep consistent with database schema, use proper TypeScript conventions

## Code Conventions

### Import Rules
- **Absolute imports**: Use `@/` path alias for all internal imports
- **Actions**: Import as default exports (`import loadCourses from '@/actions/loadCourses'`)
- **Components**: Use named imports (`import { Button } from '@/components/ui/button'`)
- **Types**: Use type-only imports (`import type { User } from '@/types'`)

### Data Flow Pattern
1. **GraphQL schema** defines data models for real-time operations
2. **REST API** handles traditional CRUD operations and file uploads
3. **Components** consume data via Amplify DataStore, GraphQL hooks, or REST API calls
4. **Context** manages global state and theming
5. **Types** are auto-generated from GraphQL schema and defined for REST APIs

### Component Architecture
- **Composition**: Prefer composition over complex prop drilling
- **Separation**: Keep business logic in GraphQL/REST operations, UI logic in components
- **Styling**: Use Tailwind classes with dynamic CSS properties for theming
- **State**: Local state with useState, server state with Amplify DataStore or REST API

## Amplify Integration
- **Schema alignment**: Auto-generated TypeScript types from GraphQL schema
- **Data modeling**: GraphQL schema with @model directives for DynamoDB tables
- **API Operations**: Use GraphQL for real-time features, REST for traditional CRUD
- **Progress tracking**: XP, streaks, completion states are core to the learning system
- **Real-time features**: GraphQL subscriptions for collaborative learning
- **File operations**: REST API for file uploads and media management

## Coach System Architecture
- **Three personalities**: Elia (methodical), Skippy (dynamic), Lupa (collaborative)
- **Theming**: Coach selection drives CSS custom property updates
- **Context integration**: Coach state affects UI colors, messaging, and interaction patterns
- **When extending**: Maintain personality consistency, update theming system accordingly