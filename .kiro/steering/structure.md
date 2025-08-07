---
inclusion: always
---

# Project Structure & Architecture Guidelines

## File Organization Rules

### Actions (`/actions/`)
- **Purpose**: SQL-based data operations using @uibakery/data
- **Pattern**: One action per file, default export
- **Naming**: Descriptive verbs (loadCourses, createUser, updateUserCoach)
- **When creating new actions**: Follow existing patterns, use SQL queries, handle errors appropriately

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
1. **Actions** define database operations with SQL
2. **Components** consume actions via `useLoadAction`/`useMutateAction` hooks
3. **Context** manages global state and theming
4. **Types** ensure type safety across all layers

### Component Architecture
- **Composition**: Prefer composition over complex prop drilling
- **Separation**: Keep business logic in actions, UI logic in components
- **Styling**: Use Tailwind classes with dynamic CSS properties for theming
- **State**: Local state with useState, server state with @uibakery/data hooks

## Database Integration
- **Schema alignment**: Ensure TypeScript types match database schema
- **Migrations**: Located in `/migrations/` with timestamp prefixes
- **Actions**: Use parameterized SQL queries, handle null/undefined values
- **Progress tracking**: XP, streaks, completion states are core to the learning system

## Coach System Architecture
- **Three personalities**: Elia (methodical), Skippy (dynamic), Lupa (collaborative)
- **Theming**: Coach selection drives CSS custom property updates
- **Context integration**: Coach state affects UI colors, messaging, and interaction patterns
- **When extending**: Maintain personality consistency, update theming system accordingly