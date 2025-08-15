import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('Task Completion Verification', () => {
  const tasksFilePath = join(process.cwd(), '.kiro/specs/zuno-learning-app/tasks.md')
  
  beforeAll(() => {
    if (!existsSync(tasksFilePath)) {
      throw new Error('Tasks file not found. This test ensures completed tasks remain completed.')
    }
  })

  it('should verify Task 1 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 1 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 1\. Initialize AWS Amplify project/)
    
    // Verify key deliverables exist
    expect(existsSync(join(process.cwd(), 'amplify'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'package.json'))).toBe(true)
    
    // Verify Bun configuration
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
    expect(packageJson.type).toBe('module')
  })

  it('should verify Task 2 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 2 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 2\. Replace mock data with Amplify/)
    
    // Verify GraphQL schema exists
    expect(existsSync(join(process.cwd(), 'amplify/backend/api/zuno/schema.graphql'))).toBe(true)
    
    // Verify actions are updated
    expect(existsSync(join(process.cwd(), 'src/actions/loadCourses.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/actions/createUser.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/actions/loadUserProfile.ts'))).toBe(true)
    
    // Verify GraphQL client exists
    expect(existsSync(join(process.cwd(), 'src/lib/graphql.ts'))).toBe(true)
  })

  it('should verify Task 3 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 3 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 3\. Rebrand from "LearnDaily Pro" to "Zuno"/)
    
    // Verify package.json has correct name
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
    expect(packageJson.name).toBe('zuno-learning-app')
    expect(packageJson.description).toContain('Zuno')
    
    // Verify favicon exists
    expect(existsSync(join(process.cwd(), 'zuno-favicon.svg'))).toBe(true)
    
    // Verify README has Zuno branding
    if (existsSync(join(process.cwd(), 'README.md'))) {
      const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf-8')
      expect(readme).toContain('Zuno')
    }
  })

  it('should verify Task 4 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 4 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 4\. Add Polpo.*adaptive coach/)
    
    // Verify coach context includes Polpo
    const coachContextPath = join(process.cwd(), 'src/contexts/CoachContext.tsx')
    if (existsSync(coachContextPath)) {
      const coachContext = readFileSync(coachContextPath, 'utf-8')
      expect(coachContext).toContain('polpo')
    }
    
    // Verify adaptive components exist
    expect(existsSync(join(process.cwd(), 'src/components/AdaptiveCoachIndicator.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/hooks/useAdaptiveBehavior.ts'))).toBe(true)
  })

  it('should verify Task 5 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 5 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 5\. Implement Zuno Manager/)
    
    // Verify Zuno Manager context exists
    expect(existsSync(join(process.cwd(), 'src/contexts/ZunoManagerContext.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/ZunoBrandHeader.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/ZunoManagerIndicator.tsx'))).toBe(true)
  })

  it('should verify Task 6 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 6 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 6\. Add AWS Cognito authentication/)
    
    // Verify auth components exist
    expect(existsSync(join(process.cwd(), 'src/components/auth'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/auth/SignInForm.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/auth/SignUpForm.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/auth/ForgotPasswordForm.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/auth/ResetPasswordForm.tsx'))).toBe(true)
    
    // Verify auth context exists
    expect(existsSync(join(process.cwd(), 'src/contexts/AuthContext.tsx'))).toBe(true)
  })

  it('should verify Task 7 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 7 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 7\. Integrate home page/)
    
    // Verify HomePage component exists
    expect(existsSync(join(process.cwd(), 'src/components/HomePage.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/home/CourseCard.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/home/LearningStats.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/components/home/MascotCharacter.tsx'))).toBe(true)
    
    // Verify React Router is configured
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
    expect(packageJson.dependencies['react-router-dom']).toBeDefined()
  })

  it('should verify Task 8 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 8 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 8\. Implement code splitting/)
    
    // Verify bundle optimization files exist
    expect(existsSync(join(process.cwd(), 'scripts/analyze-bundle.js'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/utils/preloader.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/utils/performance.ts'))).toBe(true)
    
    // Verify Vite config has optimization
    const viteConfigPath = join(process.cwd(), 'vite.config.ts')
    if (existsSync(viteConfigPath)) {
      const viteConfig = readFileSync(viteConfigPath, 'utf-8')
      expect(viteConfig).toContain('manualChunks')
    }
  })

  it('should verify Task 9 remains completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 9 is marked as completed
    expect(tasksContent).toMatch(/- \[x\] 9\. Enhance accessibility/)
    
    // Verify accessibility utilities exist
    expect(existsSync(join(process.cwd(), 'src/utils/accessibility.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/utils/responsive.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/hooks/useAccessibility.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/hooks/useResponsive.ts'))).toBe(true)
    
    // Verify documentation exists
    expect(existsSync(join(process.cwd(), 'docs/ACCESSIBILITY_AND_MOBILE.md'))).toBe(true)
  })

  it('should verify Task 10 is in progress or completed', () => {
    const tasksContent = readFileSync(tasksFilePath, 'utf-8')
    
    // Check that Task 10 is marked as in progress or completed
    expect(tasksContent).toMatch(/- \[[-x]\] 10\. Add comprehensive testing coverage/)
    
    // Verify testing infrastructure exists
    expect(existsSync(join(process.cwd(), 'vitest.config.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'playwright.config.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/test/setup.ts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/test/utils.tsx'))).toBe(true)
    
    // Verify test factories exist
    expect(existsSync(join(process.cwd(), 'tests/factories'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'tests/mocks'))).toBe(true)
    
    // Verify some test files exist
    expect(existsSync(join(process.cwd(), 'src/components/ui/button.test.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/actions/loadCourses.test.ts'))).toBe(true)
  })

  it('should verify project structure integrity', () => {
    // Verify core directories exist
    expect(existsSync(join(process.cwd(), 'src/components'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/contexts'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/actions'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/hooks'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/utils'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/types'))).toBe(true)
    
    // Verify Amplify structure
    expect(existsSync(join(process.cwd(), 'amplify/backend'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'amplify/backend/api'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'amplify/backend/auth'))).toBe(true)
    
    // Verify test structure
    expect(existsSync(join(process.cwd(), 'tests/e2e'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'tests/factories'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'tests/mocks'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'tests/tasks'))).toBe(true)
  })

  it('should verify package.json scripts are properly configured', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
    
    // Verify essential scripts exist
    expect(packageJson.scripts.dev).toBeDefined()
    expect(packageJson.scripts.build).toBeDefined()
    expect(packageJson.scripts.test).toBeDefined()
    expect(packageJson.scripts['test:coverage']).toBeDefined()
    expect(packageJson.scripts['test:e2e']).toBeDefined()
    expect(packageJson.scripts.analyze).toBeDefined()
    
    // Verify Amplify scripts
    expect(packageJson.scripts['amplify:push']).toBeDefined()
    expect(packageJson.scripts['amplify:status']).toBeDefined()
  })

  it('should verify TypeScript configuration is correct', () => {
    const tsconfigPath = join(process.cwd(), 'tsconfig.json')
    expect(existsSync(tsconfigPath)).toBe(true)
    
    // Read and strip comments for JSON parsing
    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\/\/.*$/gm, '') // Remove // comments
    
    const tsconfig = JSON.parse(tsconfigContent)
    
    // Verify path mapping is configured
    expect(tsconfig.compilerOptions.paths).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@/*']).toBeDefined()
    
    // Verify module resolution
    expect(tsconfig.compilerOptions.moduleResolution).toBe('bundler')
    expect(tsconfig.compilerOptions.allowImportingTsExtensions).toBe(true)
  })

  it('should verify build configuration excludes tests', () => {
    const tsconfigPath = join(process.cwd(), 'tsconfig.json')
    
    // Read and strip comments for JSON parsing
    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\/\/.*$/gm, '') // Remove // comments
    
    const tsconfig = JSON.parse(tsconfigContent)
    
    // Verify tests are excluded from build
    if (tsconfig.exclude) {
      const excludePatterns = tsconfig.exclude.join(' ')
      expect(excludePatterns).toMatch(/test|spec/)
    }
    
    // Verify Vite config excludes tests from build
    const viteConfigPath = join(process.cwd(), 'vite.config.ts')
    if (existsSync(viteConfigPath)) {
      const viteConfig = readFileSync(viteConfigPath, 'utf-8')
      // Tests should not be included in build
      expect(viteConfig).not.toContain('test/**')
    }
  })
})