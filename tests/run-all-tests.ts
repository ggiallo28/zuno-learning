#!/usr/bin/env bun

/**
 * Comprehensive Test Runner for Zuno Learning Platform
 * 
 * This script runs all types of tests in the correct order:
 * 1. Unit tests (utilities, pure functions)
 * 2. Integration tests (components, hooks, contexts)
 * 3. Task completion tests (ensure completed tasks stay completed)
 * 4. E2E tests (critical user flows)
 * 
 * Usage:
 *   bun tests/run-all-tests.ts [--coverage] [--watch] [--e2e]
 */

import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

interface TestResult {
  name: string
  passed: boolean
  duration: number
  output: string
}

class TestRunner {
  private results: TestResult[] = []
  private startTime = Date.now()

  constructor(
    private options: {
      coverage: boolean
      watch: boolean
      e2e: boolean
      verbose: boolean
    }
  ) {}

  async runCommand(command: string, args: string[], name: string): Promise<TestResult> {
    const startTime = Date.now()
    
    return new Promise((resolve) => {
      console.log(`\n🧪 Running ${name}...`)
      
      const child = spawn(command, args, {
        stdio: this.options.verbose ? 'inherit' : 'pipe',
        shell: true
      })

      let output = ''
      
      if (!this.options.verbose) {
        child.stdout?.on('data', (data) => {
          output += data.toString()
        })
        
        child.stderr?.on('data', (data) => {
          output += data.toString()
        })
      }

      child.on('close', (code) => {
        const duration = Date.now() - startTime
        const passed = code === 0
        
        if (passed) {
          console.log(`✅ ${name} passed (${duration}ms)`)
        } else {
          console.log(`❌ ${name} failed (${duration}ms)`)
          if (!this.options.verbose && output) {
            console.log('Output:', output.slice(-500)) // Show last 500 chars
          }
        }
        
        resolve({
          name,
          passed,
          duration,
          output
        })
      })
    })
  }

  async runUnitTests(): Promise<TestResult> {
    const args = ['run']
    
    if (this.options.coverage) {
      args.push('--coverage')
    }
    
    if (this.options.watch) {
      args.push('--watch')
    }

    // Run only unit tests (utilities, pure functions)
    args.push('src/**/*.test.ts', 'src/**/*.test.tsx')
    
    return this.runCommand('vitest', args, 'Unit Tests')
  }

  async runIntegrationTests(): Promise<TestResult> {
    const args = ['run']
    
    if (this.options.coverage) {
      args.push('--coverage')
    }

    // Run integration tests (components, hooks, contexts)
    args.push('src/components/**/*.test.tsx', 'src/hooks/**/*.test.ts', 'src/contexts/**/*.test.ts')
    
    return this.runCommand('vitest', args, 'Integration Tests')
  }

  async runTaskTests(): Promise<TestResult> {
    // Run Kiro's task tests to ensure completed tasks stay completed
    return this.runCommand('bun', ['tests/tasks/run-task-tests.ts'], 'Kiro\'s Task Tests (Completion Verification)')
  }

  async runE2ETests(): Promise<TestResult> {
    if (!this.options.e2e) {
      return {
        name: 'E2E Tests',
        passed: true,
        duration: 0,
        output: 'Skipped (use --e2e to run)'
      }
    }

    // Check if Playwright is installed
    if (!existsSync(join(process.cwd(), 'node_modules/.bin/playwright'))) {
      console.log('⚠️  Playwright not found, installing...')
      await this.runCommand('bun', ['install', 'playwright'], 'Playwright Installation')
      await this.runCommand('bunx', ['playwright', 'install'], 'Playwright Browser Installation')
    }

    const args = ['test']
    
    if (this.options.verbose) {
      args.push('--reporter=list')
    }

    return this.runCommand('bunx playwright', args, 'E2E Tests')
  }

  async runLinting(): Promise<TestResult> {
    return this.runCommand('bun', ['run', 'lint'], 'ESLint')
  }

  async runTypeChecking(): Promise<TestResult> {
    return this.runCommand('tsc', ['--noEmit'], 'TypeScript Check')
  }

  printSummary() {
    const totalDuration = Date.now() - this.startTime
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 TEST SUMMARY')
    console.log('='.repeat(60))
    
    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      const duration = `${result.duration}ms`
      console.log(`${status} ${result.name.padEnd(25)} ${duration.padStart(8)}`)
    })
    
    console.log('='.repeat(60))
    console.log(`Total: ${this.results.length} | Passed: ${passed} | Failed: ${failed}`)
    console.log(`Duration: ${totalDuration}ms`)
    
    if (failed > 0) {
      console.log('\n❌ Some tests failed. Check the output above for details.')
      process.exit(1)
    } else {
      console.log('\n🎉 All tests passed!')
      process.exit(0)
    }
  }

  async run() {
    console.log('🚀 Starting comprehensive test suite for Zuno Learning Platform')
    console.log(`Options: ${JSON.stringify(this.options)}`)

    try {
      // Run tests in order
      this.results.push(await this.runTypeChecking())
      this.results.push(await this.runLinting())
      this.results.push(await this.runUnitTests())
      this.results.push(await this.runIntegrationTests())
      this.results.push(await this.runTaskTests())
      this.results.push(await this.runE2ETests())
      
    } catch (error) {
      console.error('❌ Test runner encountered an error:', error)
      process.exit(1)
    }

    this.printSummary()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  coverage: args.includes('--coverage'),
  watch: args.includes('--watch'),
  e2e: args.includes('--e2e'),
  verbose: args.includes('--verbose') || args.includes('-v')
}

// Run the test suite
const runner = new TestRunner(options)
runner.run().catch(console.error)