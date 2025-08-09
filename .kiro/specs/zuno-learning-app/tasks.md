# Implementation Plan

## Phase 1: Foundation and Core System Enhancement

- [x] 1. Initialize AWS Amplify project with React web and Bun
  - **Amplify Initialization**: Initialize new Amplify project with React web configuration
  - **Bun Configuration**: Configure Bun as package manager for Amplify + React development
  - **Project Structure**: Set up proper src/ directory structure for Amplify + React
  - **Amplify CLI Setup**: Install and configure Amplify CLI with Bun compatibility
  - **Environment Configuration**: Set up Amplify environments (dev, staging, prod)
  - **TypeScript Configuration**: Configure TypeScript for Amplify auto-generated types
  - **Build System**: Configure Amplify build and deployment pipeline with Bun
  - **Development Workflow**: Set up local development with Amplify mock services
  - _Requirements: Serverless architecture, Amplify integration, scalability, Bun runtime_

- [x] 2. Replace mock data with Amplify DataStore or GraphQL API integration
  - **GraphQL Schema Setup**: Check schema in `schema.graphql` with `@model`, this is where you can get what is currently supported.
  - **Amplify Push**: The `amplify push` to deploy GraphQL schema and generate types has already been executed
  - **Data Layer Migration**: Replace `src/data/mockData.ts` with real GraphQL queries/mutations using Amplify DataStore or API layer
  - **Action Updates**: Update all `src/actions/*.ts` files to use Amplify-generated operations:
    - `completeLessonProgress.ts` → update progress via mutation
    - `createUser.ts` → create user with mutation
    - `enrollInCourse.ts` → create enrollment record
    - `loadCourses.ts` → query all courses
    - `loadLessons.ts` → query all lessons
    - `loadQuizQuestions.ts` → query quiz data
    - `loadUserCourses.ts` → query user-course relationships
    - `loadUserProfile.ts` → get user profile data
    - `updateUserCoach.ts` → update selected coach
  - **Auto-generated Types**: Use Amplify-generated TypeScript types for all models
  - **State Integration**: Use Amplify DataStore with React Context or SWR-like cache for global state sync
  - **Offline Handling** (optional): Enable Amplify DataStore for offline sync, or stick with AppSync GraphQL if real-time not needed
  - **Data Seeding**: Create a temporary seeding script or use Amplify Admin UI for initial content
  - **Testing**: Verify all existing React components work correctly with new backend-powered data
  - _Requirements: Cloud persistence, real-time capability (optional), type safety, production-grade scalability_


- [ ] 3. Rebrand from "LearnDaily Pro" to "Zuno://" across the application
  - **Code Integration**: Merge the code from the latest version (latest folder) of the app (which contains more features) into the current application, ensuring all existing functionality is preserved and enhanced with the new features.
  - **Brand Identity Update**: Replace all "LearnDaily Pro" references with "Zuno://" in:
    - index.html title and meta tags
    - package.json name and description
    - src/app/app.tsx navigation and headers
    - All React components with brand references
  - **Visual Identity**: Update logo, colors, and branding elements to match Zuno:// identity
  - **Favicon and Assets**: Replace favicon and any brand assets with Zuno:// branding
  - **Documentation**: Update README.md and any documentation with new brand name
  - **Configuration Files**: Update any configuration files that reference the old brand name
  - _Requirements: Consistent brand identity, professional appearance, user recognition_

- [ ] 4. Add Polpo (Octopus) adaptive coach to the coaching system
  - **Coach Configuration**: Add Polpo coach to src/contexts/CoachContext.tsx with adaptive personality traits
  - **Adaptive Theming**: Implement intelligent color-shifting theme for Polpo (teal, coral, pearl gray) that adapts based on user behavior
  - **Component Updates**: Update src/components/CoachSelection.tsx to include fourth coach option with octopus iconography
  - **SQLite Integration**: Add Polpo coach data to coach system tables and update coach selection queries
  - **Type Definitions**: Add Polpo coach type and adaptive personality traits to src/types/index.ts
  - **Adaptive Logic**: Implement adaptive behavior system that combines elements from other coaches based on user learning patterns
  - **UI Components**: Create adaptive UI elements that change based on Polpo's current adaptation mode
  - _Requirements: Four-coach system, adaptive personalization, intelligent theming, user choice_

- [ ] 5. Implement Zuno Manager as master assistant overseeing all coaches
  - **Manager System**: Create ZunoManager context and components as overarching assistant that coordinates with individual coaches
  - **Visual Integration**: Add main Zuno Manager animal logo prominently in navigation and key screens
  - **Coach Coordination**: Implement system where Zuno Manager introduces and coordinates between the four coaches
  - **Onboarding Enhancement**: Update src/components/OnboardingFlow.tsx to feature Zuno Manager as primary guide
  - **Brand Hierarchy**: Establish clear visual hierarchy with Zuno Manager as primary brand, coaches as specialized assistants
  - **Manager Personality**: Define Zuno Manager's personality as wise, coordinating, and supportive of all learning styles
  - **Component Integration**: Update all major components to acknowledge Zuno Manager's oversight role
  - _Requirements: Brand consistency, clear hierarchy, coordinated user experience, professional guidance_

- [ ] 6. Set up Amplify backend services (Auth, API, Storage)
  - **Amplify Auth**: Add AWS Cognito authentication with user management
  - **Amplify GraphQL API**: Set up AppSync GraphQL API with DynamoDB integration for real-time features
  - **Amplify REST API**: Set up API Gateway REST API with Lambda integration for traditional CRUD operations
  - **GraphQL Schema**: Design GraphQL schema with @model directives for auto-generated resolvers
  - **REST Endpoints**: Design REST API endpoints for file uploads, batch operations, and legacy integrations
  - **Amplify Storage**: Configure S3 storage for file uploads and media assets
  - **Data Migration**: Export existing SQLite data and transform for DynamoDB via GraphQL/REST
  - **Custom Resolvers**: Create Lambda resolvers for complex business logic (assessment, spaced repetition)
  - **IAM Permissions**: Configure proper IAM roles and policies for Amplify services
  - **Environment Management**: Set up Amplify environments with proper resource isolation
  - _Requirements: Serverless backend, GraphQL API, REST API, managed services, scalability_

- [ ] 7. Enhance existing React web components and UI system
  - **Navigation Enhancement**: Optimize existing React Router setup for better user experience
  - **UI Component Enhancement**: Extend existing Tailwind CSS + shadcn/ui components with new features
  - **Component Architecture**: Enhance existing React components with new functionality:
    - CourseCatalog.tsx → Add filtering and search capabilities
    - UserProfile.tsx → Add detailed analytics and progress visualization
    - LessonViewer.tsx → Add interactive elements and assessment features
    - CoachSelection.tsx → Add fourth coach (Polpo) and enhanced selection UI
    - OnboardingFlow.tsx → Add assessment-driven onboarding
  - **Styling System**: Enhance existing Tailwind CSS with coach-specific theming and animations
  - **Context Enhancement**: Extend CoachContext for four-coach system and new features
  - _Requirements: Enhanced web UI/UX, responsive design, accessibility_

- [ ] 8. Integrate Amplify services with React web frontend using Bun
  - **Amplify Configuration**: Configure Amplify client with AppSync GraphQL and API Gateway REST endpoints
  - **Authentication Integration**: Replace existing auth with Amplify Auth (Cognito) flows
  - **DataStore Integration**: Replace @uibakery/data with Amplify DataStore for offline-first functionality
  - **GraphQL Operations**: Replace SQL actions with GraphQL queries, mutations, and subscriptions for real-time features
  - **REST API Integration**: Create REST API service layer for traditional CRUD operations and file uploads
  - **Error Handling**: Update error handling for GraphQL errors, REST API errors, and offline scenarios
  - **State Management**: Integrate Amplify DataStore with React Context for global state
  - **Bun Compatibility**: Ensure Amplify libraries work optimally with Bun runtime
  - **Real-time Features**: Implement GraphQL subscriptions for collaborative features
  - _Requirements: GraphQL integration, REST API integration, offline support, real-time features, Bun compatibility_



- [ ] 9. Implement React Native coach system with Polpo (Octopus) adaptive coach
  - **CoachContext Extension**: Add Polpo configuration to contexts/CoachContext.tsx with React Native state management
  - **Mobile Theming System**: Implement intelligent color shifting theme for Polpo (teal, coral, pearl gray) using React Native styling
  - **Component Updates**: Update CoachSelection screen to include fourth coach option with mobile-optimized iconography
  - **Amplify Integration**: Update coach selection to work with Amplify GraphQL mutations on mobile
  - **Type Definitions**: Add Polpo coach type and personality traits to types/index.ts
  - **Mobile UX**: Ensure coach selection works well with touch interactions and mobile screen sizes
  - _Requirements: 2.5, 2.8, 3.4, 3.5_

- [ ] 10. Implement Zuno Manager assistant and visual design system
  - **Brand Integration**: Update App.tsx navigation to prominently feature main Zuno manager animal logo
  - **Component Updates**: Modify CoachSelection screen to show both main brand and individual coach logos
  - **Mobile Design System**: Create React Native design system with colorful but professional mobile UI patterns
  - **UI Component Enhancement**: Build mobile-optimized cards, progress bars, and badges with gradient backgrounds
  - **Progress Visualization**: Enhance UserProfile screen with engaging mobile progress visualizations and animations
  - **Visual Hierarchy**: Ensure Zuno logo visibility across all mobile screens (CourseCatalog, LessonViewer, OnboardingFlow)
  - **Mobile Responsiveness**: Ensure design works across different mobile screen sizes and orientations
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 3.1, 3.6_

- [ ] 11. Deploy and monitor Amplify application
  - **Amplify Hosting**: Deploy React web app using Amplify Hosting with CI/CD
  - **Domain Configuration**: Set up custom domain with SSL certificate via Amplify
  - **Monitoring Setup**: Configure CloudWatch monitoring for AppSync API and Lambda resolvers
  - **Analytics Integration**: Set up Amplify Analytics for user behavior tracking
  - **Performance Monitoring**: Configure X-Ray tracing for GraphQL operations
  - **Error Handling**: Set up CloudWatch alarms and error notifications
  - **Testing**: Verify all functionality works across different browsers and devices
  - _Requirements: Serverless deployment, monitoring, scalability, performance_

## Phase 2: Assessment-Driven Learning System

- [ ] 12. Build initial assessment and knowledge gap detection system for React web
  - **GraphQL Schema**: Extend Amplify GraphQL schema for assessment entities (Assessment, KnowledgeGap, SkillMap)
  - **REST API Endpoints**: Create REST API endpoints for assessment submission and batch processing
  - **Custom Resolvers**: Create Lambda resolvers for complex assessment logic and scoring
  - **Assessment Engine**: Build new AssessmentEngine.tsx React web component using both GraphQL and REST APIs
  - **Skill Map Dashboard**: Create SkillMapDashboard.tsx React web component with real-time GraphQL updates
  - **Learning Plan Generator**: Implement LearningPlanGenerator.tsx React web component with GraphQL mutations
  - **Focus Check System**: Add FocusCheck.tsx React web component with subscription updates
  - **Auto-generated Types**: Use Amplify auto-generated TypeScript types for type safety
  - **Web UX**: Ensure assessment interfaces work well with responsive web design and accessibility
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 13. Enhance React web lesson system with assessment-driven adaptation
  - **GraphQL Resolvers**: Create custom resolvers to prioritize knowledge gaps in lesson ordering
  - **REST API Integration**: Use REST API for lesson content delivery and progress updates
  - **Re-assessment System**: Update lesson completion via GraphQL mutations to trigger re-assessment of weak areas
  - **Recommendation Engine**: Enhance LessonViewer.tsx with assessment-driven recommendations via GraphQL subscriptions
  - **Progress Integration**: Update user profile queries to include assessment results in progress tracking
  - **XP System Integration**: Modify XP calculation resolvers to factor in assessment performance
  - **Streak System**: Update streak tracking with assessment-driven learning milestones
  - _Requirements: 12.2, 12.3, 12.7, 8.2, 8.3_

## Phase 3: Enhanced Learning Features

- [ ] 14. Enhance existing adaptive difficulty system
  - **Lesson Duration Control**: Modify LessonViewer.tsx to implement 3-5 minute duration targeting with progress indicators
  - **Difficulty Logic**: Update actions/completeLessonProgress.ts with >80% accuracy for increases, <60% for decreases
  - **Analytics Enhancement**: Enhance actions/loadUserProfile.ts with detailed performance tracking and trend analysis
  - **Missed Lesson Handling**: Implement automatic difficulty downward adjustment after 3+ days in lesson loading actions
  - **Feedback System**: Add immediate feedback components to LessonViewer.tsx for lesson completion
  - **Database Schema**: Add difficulty_adjustments table migration for tracking adaptation history
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 8.2, 8.3, 8.4_

- [ ] 15. Implement spaced repetition system
  - **GraphQL Schema**: Add spaced repetition models (ReviewCard, ReviewSession, ReviewSchedule) to Amplify schema
  - **REST API Endpoints**: Create REST API endpoints for bulk review operations and scheduling
  - **SM-2 Algorithm**: Implement SpacedRepetitionEngine.tsx with Lambda resolver for SM-2 algorithm
  - **Review Interface**: Extend LessonViewer.tsx with review session mode using both GraphQL and REST APIs
  - **GraphQL Operations**: Create GraphQL queries/mutations for loadDueReviews, completeReview, scheduleReview
  - **Notification System**: Build ReviewNotifications.tsx with coach-specific messaging and GraphQL subscriptions
  - **Progress Integration**: Update user profile GraphQL schema to include spaced repetition data
  - **XP Integration**: Modify existing XP and streak resolvers to reward consistent review completion
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 16. Enhance interactive learning elements in existing lessons
  - **Quiz Enhancement**: Extend existing quiz components in LessonViewer.tsx with immediate feedback via GraphQL
  - **Practice Interface**: Add PracticeTaskInterface.tsx component with performance tracking using both GraphQL and REST APIs
  - **Mini-Game Framework**: Create MiniGameFramework.tsx that integrates with lesson types from GraphQL schema
  - **File Upload Integration**: Use REST API for uploading practice exercises and multimedia content
  - **User Preferences**: Update GraphQL User model and UserProfile.tsx to track interaction type preferences
  - **Feedback System**: Enhance existing feedback components with detailed explanations stored in GraphQL
  - **Schema Enhancement**: Add interaction preferences and detailed feedback to Amplify GraphQL schema
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 17. Extend existing gamification system with professional visual enhancements
  - Enhance existing XP calculation to include performance and difficulty factors
  - Extend existing level and badge system with sophisticated, professional badge designs
  - Improve existing streak tracking with engaging visual elements (fire/energy indicators)
  - Add optional leaderboard system with clean, competitive but friendly design
  - Enhance existing achievement system with coach-specific celebrations and subtle animations
  - Add gamification customization options (minimal/moderate/full) to user settings
  - Implement progress visualization with animated bars, completion percentages, and milestone markers
  - Create achievement unlocks with satisfying but professional animations
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

## Phase 4: Collaborative Learning (Lupa Mode Enhancement)

- [ ] 18. Implement real-time collaborative learning features for Lupa mode
  - Create study group creation and management system using existing database
  - Build real-time group session functionality (may require WebSocket integration)
  - Implement group challenges and shared learning activities
  - Create chat and voice interaction features for group sessions
  - Build peer-to-peer learning activity framework
  - Implement collective achievement system for group progress
  - Add privacy controls for collaborative vs solo learning within Lupa mode
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

## Phase 5: Content and Analytics Enhancement

- [ ] 19. Enhance existing content management system
  - Extend existing course/lesson system to support multi-subject expandability
  - Improve content discovery by subject and difficulty using existing filters
  - Enhance coach-specific content adaptation in existing lesson delivery
  - Implement prerequisite checking and learning path generation
  - Add content versioning to existing content management
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 20. Extend existing analytics and progress tracking
  - Enhance existing progress dashboard with detailed analytics
  - Implement learning pattern detection and automatic adaptation
  - Extend existing accuracy and time tracking with trend analysis
  - Add personalized study schedule suggestions
  - Implement progress export functionality for premium users
  - Add analytics data pipeline with privacy controls
  - _Requirements: 8.1, 8.2, 8.5, 14.2, 14.6_

## Phase 6: Premium Features and User Experience

- [ ] 21. Implement freemium model enhancements
  - Extend existing subscription system with more sophisticated tier management
  - Add ad-supported free tier functionality (if not already present)
  - Implement premium feature gating for advanced analytics and offline access
  - Create AI-powered explanations and guidance for premium users
  - Add advanced simulation scenarios for premium practice
  - Enhance existing subscription management with graceful downgrade
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 22. Add offline mode and focus mode features
  - Implement content download and offline storage system
  - Build offline progress tracking with sync capabilities
  - Create Focus Mode with minimized gamification and distractions
  - Implement quiet feedback system for Focus Mode
  - Build seamless online/offline synchronization
  - Create offline content management for premium users
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

## Phase 7: Voice, Privacy, and User Control

- [ ] 23. Implement Zuno voice and tone consistency system
  - Update all existing messaging to follow Zuno brand voice guidelines
  - Enhance coach-specific messaging within professional brand guidelines
  - Improve existing feedback system with context-aware, specific guidance
  - Update all system messaging to feel like it comes from Zuno/chosen coach
  - Implement tone validation for all user-facing text
  - Enhance error messaging with helpful, intelligent tone
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [ ] 24. Enhance privacy controls and personalization settings
  - Extend existing user settings with comprehensive privacy controls
  - Add options to adjust personalization depth and AI suggestions
  - Implement granular toggles for analytics tracking and recommendations
  - Enhance notification controls with frequency, type, and tone options
  - Add coach communication preference controls
  - Implement data deletion and export functionality
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

## Phase 8: Enhanced Onboarding and Final Integration

- [ ] 25. Redesign onboarding experience for Zuno
  - Update existing onboarding to feature main Zuno manager animal introduction
  - Enhance coach explanation and selection with all four coaches
  - Add sample lesson system for coach demonstration
  - Integrate optional initial assessment into onboarding flow
  - Implement coach-specific onboarding flows (collaborative for Lupa, customization for Polpo)
  - Add assessment-driven learning plan generation to onboarding
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8_

- [ ] 26. Implement comprehensive notification system
  - Create personalized notification system with coach-specific messaging
  - Build spaced repetition reminder scheduling
  - Enhance existing streak maintenance notifications
  - Add group session and collaborative learning reminders
  - Implement granular notification preference management
  - Add quiet notification system for Focus Mode
  - _Requirements: 6.4, 14.3, 15.4_

- [ ] 27. Enhance error handling and recovery systems
  - Improve existing error handling with graceful degradation for offline scenarios
  - Add fallback systems for any AI service failures
  - Create error recovery for coach system failures
  - Implement network error handling with cached content
  - Build assessment failure recovery with performance-based adaptation
  - Enhance user-friendly error messaging with recovery suggestions
  - _Requirements: 1.5, 15.3, 15.5_

- [ ] 28. Final integration testing and quality assurance
  - Test all refactored systems with existing UI Bakery data layer
  - Verify coach system works properly with all four coaches
  - Test assessment-driven learning integration with existing progress tracking
  - Validate collaborative learning features work with existing user system
  - Test all privacy controls and user preference systems
  - Verify brand consistency across all coach modes and features
  - Conduct comprehensive user journey testing for all coach personalities
  - _Requirements: All requirements validation_
