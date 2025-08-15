#!/usr/bin/env bun

/**
 * Comprehensive Testing Implementation Verification Script
 * 
 * This script verifies that Task 10 "Add comprehensive testing coverage" 
 * has been properly implemented with all required testing infrastructure.
 * 
 * Usage: bun src/scripts/testComprehensiveTesting.ts
 */

import { existsSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

interface TestResult {
  category: string
  test: string
  passed: boolean
  message: string
}

class ComprehensiveTestingVerifier {
  private results: TestResult[] = []
  private readonly projectRoot = process.cwd()

  private addResult(category: string, test: string, passed: boolean, message: string) {
    this.results.push({ category, test, passed, message })
    const status = passed ? '✅' : '❌'
    console.log(`${status} ${category}: ${test} - ${message}`)
  }

  private fileExists(path: string): boolean {
    return existsSync(join(this.projectRoot, path))
  }

  private readFile(path: string): string {
    try {
      return readFileSync(join(this.projectRoot, path), 'utf-8')
    } catch {
      return ''
    }
  }

  private async runCommand(command: string, args: string[]): Promise<{ success: boolean, output: string }> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { 
        stdio: 'pipe',
        shell: true,
        cwd: this.projectRoot
      })

      let output = ''
      child.stdout?.on('data', (data) => output += data.toString())
      child.stderr?.on('data', (data) => output += data.toString())

      child.on('close', (code) => {
        resolve({ success: code === 0, output })
      })
    })
  }

  async testDependencyInstallation() {
    console.log('\n📦 Testing Dependency Installation...')

    const packageJson = this.readFile('package.json')
    if (!packageJson) {
      this.addResult('Dependencies', 'Package.json exists', false, 'package.json not found')
      return
    }

    const pkg = JSON.parse(packageJson)
    const devDeps = pkg.devDependencies || {}

    // Test framework dependencies
    const requiredDeps = [
      '@testing-library/jest-dom',
      '@testing-library/react', 
      '@testing-library/user-event',
      '@vitest/coverage-v8',
      '@vitest/ui',
      'vitest',
      'jsdom',
      'msw',
      'playwright'
    ]

    requiredDeps.forEach(dep => {
      const installed = dep in devDeps
      this.addResult('Dependencies', `${dep} installed`, installed, 
        installed ? `Version: ${devDeps[dep]}` : 'Missing from devDependencies')
    })

    // Check if dependencies are actually installed
    const nodeModulesExists = this.fileExists('node_modules')
    this.addResult('Dependencies', 'node_modules exists', nodeModulesExists, 
      nodeModulesExists ? 'Dependencies installed' : 'Run bun install')
  }

  testConfigurationFiles() {
    console.log('\n⚙️ Testing Configuration Files...')

    // Vitest configuration
    const vitestConfigExists = this.fileExists('vitest.config.ts')
    this.addResult('Configuration', 'vitest.config.ts exists', vitestConfigExists,
      vitestConfigExists ? 'Vitest configuration found' : 'Missing Vitest configuration')

    if (vitestConfigExists) {
      const vitestConfig = this.readFile('vitest.config.ts')
      const hasJsdom = vitestConfig.includes('jsdom')
      const hasSetup = vitestConfig.includes('setup.ts')
      const hasCoverage = vitestConfig.includes('coverage')
      
      this.addResult('Configuration', 'Vitest jsdom environment', hasJsdom,
        hasJsdom ? 'jsdom environment configured' : 'Missing jsdom environment')
      this.addResult('Configuration', 'Vitest setup file', hasSetup,
        hasSetup ? 'Setup file configured' : 'Missing setup file reference')
      this.addResult('Configuration', 'Vitest coverage', hasCoverage,
        hasCoverage ? 'Coverage configuration found' : 'Missing coverage configuration')
    }

    // Playwright configuration
    const playwrightConfigExists = this.fileExists('playwright.config.ts')
    this.addResult('Configuration', 'playwright.config.ts exists', playwrightConfigExists,
      playwrightConfigExists ? 'Playwright configuration found' : 'Missing Playwright configuration')

    if (playwrightConfigExists) {
      const playwrightConfig = this.readFile('playwright.config.ts')
      const hasMultipleBrowsers = playwrightConfig.includes('chromium') && 
                                  playwrightConfig.includes('firefox') && 
                                  playwrightConfig.includes('webkit')
      const hasWebServer = playwrightConfig.includes('webServer')
      
      this.addResult('Configuration', 'Playwright multiple browsers', hasMultipleBrowsers,
        hasMultipleBrowsers ? 'Multiple browsers configured' : 'Missing browser configurations')
      this.addResult('Configuration', 'Playwright web server', hasWebServer,
        hasWebServer ? 'Web server configuration found' : 'Missing web server configuration')
    }
  }

  testTestStructure() {
    console.log('\n📁 Testing Test Structure...')

    // Test directories
    const testDirs = [
      'tests/e2e',
      'tests/mocks', 
      'tests/factories',
      'tests/tasks',
      'src/test'
    ]

    testDirs.forEach(dir => {
      const exists = this.fileExists(dir)
      this.addResult('Structure', `${dir} directory`, exists,
        exists ? 'Directory exists' : 'Missing directory')
    })

    // Test setup files
    const setupFiles = [
      'src/test/setup.ts',
      'src/test/utils.tsx',
      'tests/mocks/handlers.ts',
      'tests/mocks/server.ts'
    ]

    setupFiles.forEach(file => {
      const exists = this.fileExists(file)
      this.addResult('Structure', `${file}`, exists,
        exists ? 'Setup file exists' : 'Missing setup file')
    })

    // Test factories
    const factories = [
      'tests/factories/userFactory.ts',
      'tests/factories/courseFactory.ts',
      'tests/factories/coachFactory.ts'
    ]

    factories.forEach(factory => {
      const exists = this.fileExists(factory)
      this.addResult('Structure', `${factory}`, exists,
        exists ? 'Factory exists' : 'Missing factory')
    })
  }

  testUnitTests() {
    console.log('\n🧪 Testing Unit Tests...')

    // Check for unit test files
    const unitTestFiles = [
      'src/utils/accessibility.test.ts',
      'src/utils/testUtils.test.ts',
      'src/components/ui/button.test.tsx',
      'src/hooks/useAmplifyData.test.ts'
    ]

    unitTestFiles.forEach(testFile => {
      const exists = this.fileExists(testFile)
      this.addResult('Unit Tests', testFile, exists,
        exists ? 'Unit test file exists' : 'Missing unit test file')

      if (exists) {
        const content = this.readFile(testFile)
        const hasDescribe = content.includes('describe(')
        const hasIt = content.includes('it(') || content.includes('test(')
        const hasExpect = content.includes('expect(')

        this.addResult('Unit Tests', `${testFile} structure`, hasDescribe && hasIt && hasExpect,
          hasDescribe && hasIt && hasExpect ? 'Proper test structure' : 'Invalid test structure')
      }
    })
  }

  testIntegrationTests() {
    console.log('\n🔗 Testing Integration Tests...')

    const integrationTestFiles = [
      'src/components/CoachSelection.test.tsx',
      'src/components/CourseCatalog.test.tsx'
    ]

    integrationTestFiles.forEach(testFile => {
      const exists = this.fileExists(testFile)
      this.addResult('Integration Tests', testFile, exists,
        exists ? 'Integration test file exists' : 'Missing integration test file')

      if (exists) {
        const content = this.readFile(testFile)
        const hasRender = content.includes('render(')
        const hasScreen = content.includes('screen.')
        const hasUserEvent = content.includes('userEvent') || content.includes('fireEvent')

        this.addResult('Integration Tests', `${testFile} React Testing Library`, 
          hasRender && hasScreen, 
          hasRender && hasScreen ? 'Uses React Testing Library' : 'Missing RTL usage')
      }
    })
  }

  testE2ETests() {
    console.log('\n🌐 Testing E2E Tests...')

    const e2eTestFiles = [
      'tests/e2e/auth.spec.ts',
      'tests/e2e/course-catalog.spec.ts'
    ]

    e2eTestFiles.forEach(testFile => {
      const exists = this.fileExists(testFile)
      this.addResult('E2E Tests', testFile, exists,
        exists ? 'E2E test file exists' : 'Missing E2E test file')

      if (exists) {
        const content = this.readFile(testFile)
        const hasPlaywrightImport = content.includes('@playwright/test')
        const hasTestDescribe = content.includes('test.describe')
        const hasPageInteraction = content.includes('page.')

        this.addResult('E2E Tests', `${testFile} Playwright usage`, 
          hasPlaywrightImport && hasTestDescribe && hasPageInteraction,
          hasPlaywrightImport && hasTestDescribe && hasPageInteraction ? 
            'Proper Playwright usage' : 'Invalid Playwright test structure')
      }
    })
  }

  testTaskCompletionTests() {
    console.log('\n📋 Testing Task Completion Tests...')

    const taskTestFile = 'tests/tasks/task-completion.test.ts'
    const exists = this.fileExists(taskTestFile)
    this.addResult('Task Tests', 'task-completion.test.ts', exists,
      exists ? 'Task completion test exists' : 'Missing task completion test')

    if (exists) {
      const content = this.readFile(taskTestFile)
      const hasTaskValidation = content.includes('Task Completion Persistence')
      const hasPhaseValidation = content.includes('Phase 1: Foundation')
      const hasStatusValidation = content.includes('Task Status Validation')

      this.addResult('Task Tests', 'Task validation logic', hasTaskValidation,
        hasTaskValidation ? 'Task validation implemented' : 'Missing task validation')
      this.addResult('Task Tests', 'Phase validation', hasPhaseValidation,
        hasPhaseValidation ? 'Phase validation implemented' : 'Missing phase validation')
      this.addResult('Task Tests', 'Status validation', hasStatusValidation,
        hasStatusValidation ? 'Status validation implemented' : 'Missing status validation')
    }
  }

  testPackageJsonScripts() {
    console.log('\n📜 Testing Package.json Scripts...')

    const packageJson = this.readFile('package.json')
    if (!packageJson) {
      this.addResult('Scripts', 'Package.json readable', false, 'Cannot read package.json')
      return
    }

    const pkg = JSON.parse(packageJson)
    const scripts = pkg.scripts || {}

    const requiredScripts = [
      'test',
      'test:run', 
      'test:coverage',
      'test:watch',
      'test:e2e',
      'test:tasks'
    ]

    requiredScripts.forEach(script => {
      const exists = script in scripts
      this.addResult('Scripts', `${script} script`, exists,
        exists ? `Command: ${scripts[script]}` : 'Missing script')
    })
  }

  testTypeScriptExclusions() {
    console.log('\n📝 Testing TypeScript Configuration...')

    const tsconfigExists = this.fileExists('tsconfig.json')
    this.addResult('TypeScript', 'tsconfig.json exists', tsconfigExists,
      tsconfigExists ? 'TypeScript config found' : 'Missing TypeScript config')

    if (tsconfigExists) {
      const tsconfig = this.readFile('tsconfig.json')
      const hasTestExclusions = tsconfig.includes('**/*.test.ts') && 
                               tsconfig.includes('**/*.spec.ts') &&
                               tsconfig.includes('tests/**/*')

      this.addResult('TypeScript', 'Test file exclusions', hasTestExclusions,
        hasTestExclusions ? 'Test files excluded from build' : 'Missing test exclusions')
    }
  }

  async testTestExecution() {
    console.log('\n🏃 Testing Test Execution...')

    // Test Vitest execution
    const vitestResult = await this.runCommand('bunx', ['vitest', 'run', '--reporter=basic', 'src/utils/testUtils.test.ts'])
    this.addResult('Execution', 'Vitest can run', vitestResult.success,
      vitestResult.success ? 'Vitest executed successfully' : `Vitest failed: ${vitestResult.output.slice(-100)}`)

    // Test TypeScript compilation
    const tscResult = await this.runCommand('bunx', ['tsc', '--noEmit'])
    this.addResult('Execution', 'TypeScript compilation', tscResult.success,
      tscResult.success ? 'TypeScript compiles without errors' : 'TypeScript compilation errors')

    // Test task completion tests
    const taskTestResult = await this.runCommand('bunx', ['vitest', 'run', '--reporter=basic', 'tests/tasks/task-completion.test.ts'])
    this.addResult('Execution', 'Task completion tests', taskTestResult.success,
      taskTestResult.success ? 'Task tests pass' : 'Task tests failed')
  }

  testCoverageConfiguration() {
    console.log('\n📊 Testing Coverage Configuration...')

    const vitestConfig = this.readFile('vitest.config.ts')
    if (!vitestConfig) {
      this.addResult('Coverage', 'Vitest config readable', false, 'Cannot read vitest.config.ts')
      return
    }

    const hasV8Provider = vitestConfig.includes("provider: 'v8'")
    const hasThresholds = vitestConfig.includes('thresholds')
    const hasReporters = vitestConfig.includes('reporter')
    const hasExcludes = vitestConfig.includes('exclude')

    this.addResult('Coverage', 'V8 coverage provider', hasV8Provider,
      hasV8Provider ? 'V8 provider configured' : 'Missing V8 provider')
    this.addResult('Coverage', 'Coverage thresholds', hasThresholds,
      hasThresholds ? 'Thresholds configured' : 'Missing coverage thresholds')
    this.addResult('Coverage', 'Coverage reporters', hasReporters,
      hasReporters ? 'Reporters configured' : 'Missing coverage reporters')
    this.addResult('Coverage', 'Coverage exclusions', hasExcludes,
      hasExcludes ? 'Exclusions configured' : 'Missing coverage exclusions')
  }

  testMSWSetup() {
    console.log('\n🔧 Testing MSW Setup...')

    const setupFile = this.readFile('src/test/setup.ts')
    const handlersFile = this.readFile('tests/mocks/handlers.ts')
    const serverFile = this.readFile('tests/mocks/server.ts')

    const setupHasMSW = setupFile.includes('msw') && setupFile.includes('setupServer')
    const handlersExist = handlersFile.includes('http') && handlersFile.includes('HttpResponse')
    const serverExist = serverFile.includes('setupServer') && serverFile.includes('handlers')

    this.addResult('MSW', 'MSW setup in test setup', setupHasMSW,
      setupHasMSW ? 'MSW configured in setup' : 'Missing MSW setup')
    this.addResult('MSW', 'MSW handlers defined', handlersExist,
      handlersExist ? 'MSW handlers exist' : 'Missing MSW handlers')
    this.addResult('MSW', 'MSW server configured', serverExist,
      serverExist ? 'MSW server configured' : 'Missing MSW server')
  }

  testTestUtilities() {
    console.log('\n🛠️ Testing Test Utilities...')

    const utilsFile = this.readFile('src/test/utils.tsx')
    
    const hasCustomRender = utilsFile.includes('customRender')
    const hasProviders = utilsFile.includes('AllTheProviders')
    const hasMockHelpers = utilsFile.includes('mockLocalStorage') && utilsFile.includes('mockIntersectionObserver')
    const hasFactoryHelpers = utilsFile.includes('createMockComponent')

    this.addResult('Test Utils', 'Custom render function', hasCustomRender,
      hasCustomRender ? 'Custom render with providers' : 'Missing custom render')
    this.addResult('Test Utils', 'Provider wrappers', hasProviders,
      hasProviders ? 'Provider wrappers exist' : 'Missing provider wrappers')
    this.addResult('Test Utils', 'Mock helpers', hasMockHelpers,
      hasMockHelpers ? 'Mock helpers available' : 'Missing mock helpers')
    this.addResult('Test Utils', 'Factory helpers', hasFactoryHelpers,
      hasFactoryHelpers ? 'Factory helpers available' : 'Missing factory helpers')
  }

  generateSummary() {
    console.log('\n' + '='.repeat(80))
    console.log('📊 COMPREHENSIVE TESTING IMPLEMENTATION VERIFICATION SUMMARY')
    console.log('='.repeat(80))

    const categories = [...new Set(this.results.map(r => r.category))]
    
    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category)
      const passed = categoryResults.filter(r => r.passed).length
      const total = categoryResults.length
      const percentage = Math.round((passed / total) * 100)
      
      console.log(`\n${category}:`)
      console.log(`  ✅ Passed: ${passed}/${total} (${percentage}%)`)
      
      const failed = categoryResults.filter(r => !r.passed)
      if (failed.length > 0) {
        console.log(`  ❌ Failed tests:`)
        failed.forEach(f => console.log(`    - ${f.test}: ${f.message}`))
      }
    })

    const totalPassed = this.results.filter(r => r.passed).length
    const totalTests = this.results.length
    const overallPercentage = Math.round((totalPassed / totalTests) * 100)

    console.log('\n' + '='.repeat(80))
    console.log(`📈 OVERALL RESULTS: ${totalPassed}/${totalTests} tests passed (${overallPercentage}%)`)
    
    if (overallPercentage >= 90) {
      console.log('🎉 EXCELLENT: Comprehensive testing implementation is complete!')
    } else if (overallPercentage >= 75) {
      console.log('✅ GOOD: Most testing infrastructure is in place, minor issues to address')
    } else if (overallPercentage >= 50) {
      console.log('⚠️  PARTIAL: Testing infrastructure partially implemented, significant work needed')
    } else {
      console.log('❌ INCOMPLETE: Testing infrastructure needs major implementation work')
    }

    console.log('='.repeat(80))

    return overallPercentage >= 75
  }

  async run() {
    console.log('🧪 Starting Comprehensive Testing Implementation Verification...')
    console.log(`📁 Project Root: ${this.projectRoot}`)
    console.log('⏰ Timestamp:', new Date().toISOString())

    try {
      await this.testDependencyInstallation()
      this.testConfigurationFiles()
      this.testTestStructure()
      this.testUnitTests()
      this.testIntegrationTests()
      this.testE2ETests()
      this.testTaskCompletionTests()
      this.testPackageJsonScripts()
      this.testTypeScriptExclusions()
      this.testCoverageConfiguration()
      this.testMSWSetup()
      this.testTestUtilities()
      await this.testTestExecution()

      const success = this.generateSummary()
      process.exit(success ? 0 : 1)

    } catch (error) {
      console.error('❌ Verification failed with error:', error)
      process.exit(1)
    }
  }
}

// Run the verification if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const verifier = new ComprehensiveTestingVerifier()
  verifier.run().catch(console.error)
}