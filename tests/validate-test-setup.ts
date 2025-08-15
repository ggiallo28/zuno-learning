#!/usr/bin/env bun

/**
 * Test Setup Validation Script
 * 
 * This script validates that the comprehensive testing system is properly
 * configured and all test types are working correctly.
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

interface ValidationResult {
  category: string
  test: string
  passed: boolean
  message: string
}

class TestSetupValidator {
  private results: ValidationResult[] = []

  validate(category: string, test: string, condition: boolean, message: string) {
    this.results.push({
      category,
      test,
      passed: condition,
      message
    })

    const status = condition ? '✅' : '❌'
    console.log(`${status} ${category}: ${test} - ${message}`)
  }

  async validateFileStructure() {
    console.log('\n📁 Validating Test File Structure...')

    // Test directories
    this.validate('Structure', 'E2E Directory', existsSync('tests/e2e'), 'E2E tests directory exists')
    this.validate('Structure', 'Mocks Directory', existsSync('tests/mocks'), 'Mocks directory exists')
    this.validate('Structure', 'Factories Directory', existsSync('tests/factories'), 'Factories directory exists')
    this.validate('Structure', 'Tasks Directory', existsSync('tests/tasks'), 'Tasks directory exists')

    // Configuration files
    this.validate('Config', 'Vitest Config', existsSync('vitest.config.ts'), 'Vitest configuration exists')
    this.validate('Config', 'Playwright Config', existsSync('playwright.config.ts'), 'Playwright configuration exists')
    this.validate('Config', 'Test Setup', existsSync('src/test/setup.ts'), 'Test setup file exists')

    // Test utilities
    this.validate('Utils', 'Test Utils', existsSync('src/test/utils.tsx'), 'Test utilities exist')
    this.validate('Utils', 'MSW Handlers', existsSync('tests/mocks/handlers.ts'), 'MSW handlers exist')
    this.validate('Utils', 'Test Factories', existsSync('tests/factories/userFactory.ts'), 'Test factories exist')

    // Task tests (moved from src/scripts)
    const taskTests = [
      'testAccessibilityAndResponsive.ts',
      'testBundleOptimization.ts',
      'testCrossBrowserLayout.ts',
      'testMobileFooterLayout.ts',
      'testMobileLayout.ts',
      'testResponsiveLayout.ts',
      'testVisualRegressionAccessibility.ts',
      'verifyAccessibilityImplementation.ts',
      'task-completion.test.ts'
    ]

    taskTests.forEach(testFile => {
      this.validate(
        'Task Tests',
        testFile,
        existsSync(join('tests/tasks', testFile)),
        `Task test ${testFile} moved to proper location`
      )
    })

    // Ensure old test files are removed from src/scripts
    const oldTestFiles = [
      'src/scripts/testAccessibilityAndResponsive.ts',
      'src/scripts/testBundleOptimization.ts',
      'src/scripts/testCrossBrowserLayout.ts',
      'src/scripts/testMobileFooterLayout.ts',
      'src/scripts/testMobileLayout.ts',
      'src/scripts/testResponsiveLayout.ts',
      'src/scripts/testVisualRegressionAccessibility.ts',
      'src/scripts/verifyAccessibilityImplementation.ts'
    ]

    oldTestFiles.forEach(oldFile => {
      this.validate(
        'Cleanup',
        oldFile,
        !existsSync(oldFile),
        `Old test file removed from src/scripts`
      )
    })
  }

  async validateTestTypes() {
    console.log('\n🧪 Validating Test Types...')

    // Unit tests
    const unitTests = [
      'src/utils/accessibility.test.ts',
      'src/utils/testUtils.test.ts',
      'src/components/ui/button.test.tsx'
    ]

    unitTests.forEach(testFile => {
      this.validate(
        'Unit Tests',
        testFile,
        existsSync(testFile),
        'Unit test exists alongside source file'
      )
    })

    // Integration tests
    const integrationTests = [
      'src/components/CoachSelection.test.tsx',
      'src/components/CourseCatalog.test.tsx',
      'src/hooks/useAmplifyData.test.ts'
    ]

    integrationTests.forEach(testFile => {
      this.validate(
        'Integration Tests',
        testFile,
        existsSync(testFile),
        'Integration test exists'
      )
    })

    // E2E tests
    const e2eTests = [
      'tests/e2e/auth.spec.ts',
      'tests/e2e/course-catalog.spec.ts'
    ]

    e2eTests.forEach(testFile => {
      this.validate(
        'E2E Tests',
        testFile,
        existsSync(testFile),
        'E2E test exists'
      )
    })

    // Task tests
    this.validate(
      'Task Tests',
      'Task Runner',
      existsSync('tests/tasks/run-task-tests.ts'),
      'Task test runner exists'
    )
  }

  async validatePackageJson() {
    console.log('\n📦 Validating Package.json Configuration...')

    try {
      const packageJson = await import(join(process.cwd(), 'package.json'))
      const scripts = packageJson.scripts || {}
      const devDeps = packageJson.devDependencies || {}

      // Test scripts
      this.validate('Scripts', 'test', 'test' in scripts, 'Basic test script exists')
      this.validate('Scripts', 'test:run', 'test:run' in scripts, 'Test run script exists')
      this.validate('Scripts', 'test:coverage', 'test:coverage' in scripts, 'Coverage script exists')
      this.validate('Scripts', 'test:e2e', 'test:e2e' in scripts, 'E2E test script exists')
      this.validate('Scripts', 'test:tasks', 'test:tasks' in scripts, 'Task test script exists')

      // Dependencies
      const requiredDeps = [
        'vitest',
        '@vitest/coverage-v8',
        '@vitest/ui',
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event',
        'jsdom',
        'msw',
        'playwright'
      ]

      requiredDeps.forEach(dep => {
        this.validate(
          'Dependencies',
          dep,
          dep in devDeps,
          `Required testing dependency ${dep} is installed`
        )
      })

    } catch (error) {
      this.validate('Package', 'Read Error', false, `Failed to read package.json: ${error}`)
    }
  }

  async runQuickTest(command: string, args: string[], testName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true
      })

      let output = ''
      child.stdout?.on('data', (data) => output += data.toString())
      child.stderr?.on('data', (data) => output += data.toString())

      const timeout = setTimeout(() => {
        child.kill()
        resolve(false)
      }, 10000) // 10 second timeout

      child.on('close', (code) => {
        clearTimeout(timeout)
        resolve(code === 0)
      })
    })
  }

  async validateTestExecution() {
    console.log('\n⚡ Validating Test Execution...')

    // Test TypeScript compilation
    const tscPassed = await this.runQuickTest('tsc', ['--noEmit'], 'TypeScript Check')
    this.validate('Execution', 'TypeScript', tscPassed, 'TypeScript compilation passes')

    // Test Vitest can run
    const vitestPassed = await this.runQuickTest('vitest', ['run', '--reporter=basic', 'src/utils/testUtils.test.ts'], 'Vitest Execution')
    this.validate('Execution', 'Vitest', vitestPassed, 'Vitest can execute tests')

    // Test task completion test
    const taskTestPassed = await this.runQuickTest('vitest', ['run', '--reporter=basic', 'tests/tasks/task-completion.test.ts'], 'Task Completion Test')
    this.validate('Execution', 'Task Tests', taskTestPassed, 'Task completion tests can run')
  }

  printSummary() {
    const categories = [...new Set(this.results.map(r => r.category))]
    const totalTests = this.results.length
    const passedTests = this.results.filter(r => r.passed).length
    const failedTests = totalTests - passedTests

    console.log('\n' + '='.repeat(80))
    console.log('📊 TEST SETUP VALIDATION SUMMARY')
    console.log('='.repeat(80))

    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category)
      const categoryPassed = categoryResults.filter(r => r.passed).length
      const categoryTotal = categoryResults.length
      
      console.log(`${category}: ${categoryPassed}/${categoryTotal} passed`)
    })

    console.log('='.repeat(80))
    console.log(`Total: ${passedTests}/${totalTests} validations passed`)

    if (failedTests > 0) {
      console.log('\n❌ Test setup validation failed!')
      console.log('The following issues need to be resolved:')
      
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.category}: ${result.test} - ${result.message}`)
      })
      
      process.exit(1)
    } else {
      console.log('\n🎉 Test setup validation passed!')
      console.log('✅ Comprehensive testing system is properly configured.')
      console.log('✅ All test types are available and functional.')
      console.log('✅ Task tests are properly organized in tests/tasks/')
      process.exit(0)
    }
  }

  async run() {
    console.log('🔍 Validating Comprehensive Testing Setup for Zuno Learning Platform')
    console.log('🎯 Ensuring all test types are properly configured and functional\n')

    await this.validateFileStructure()
    await this.validateTestTypes()
    await this.validatePackageJson()
    await this.validateTestExecution()

    this.printSummary()
  }
}

// Run validation
const validator = new TestSetupValidator()
validator.run().catch(console.error)