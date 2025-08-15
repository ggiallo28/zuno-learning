#!/usr/bin/env bun

/**
 * Kiro's Task Tests Runner
 * 
 * This script runs all task-specific tests to ensure that completed tasks
 * remain completed across sessions and code updates. These are the "AI-generated
 * Kiro's task tests" as specified in the requirements.
 * 
 * Usage:
 *   bun tests/tasks/run-task-tests.ts
 */

import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

interface TaskTestResult {
  taskName: string
  testFile: string
  passed: boolean
  duration: number
  output: string
}

class TaskTestRunner {
  private results: TaskTestResult[] = []
  private startTime = Date.now()

  // Map of task test files to their corresponding completed tasks
  private taskTests = [
    {
      taskName: 'Task 1: AWS Amplify + Bun Setup',
      testFile: 'tests/tasks/testComprehensiveTesting.ts',
      description: 'Verify Amplify and Bun setup remains functional'
    },
    {
      taskName: 'Task 6: Home Page Layout Fixes',
      testFile: 'tests/tasks/testMobileFooterLayout.ts',
      description: 'Ensure mobile footer layout fixes remain applied'
    },
    {
      taskName: 'Task 6: Responsive Layout',
      testFile: 'tests/tasks/testResponsiveLayout.ts',
      description: 'Verify responsive layout implementations'
    },
    {
      taskName: 'Task 6: Cross-Browser Layout',
      testFile: 'tests/tasks/testCrossBrowserLayout.ts',
      description: 'Ensure cross-browser compatibility remains intact'
    },
    {
      taskName: 'Task 6: Mobile Layout',
      testFile: 'tests/tasks/testMobileLayout.ts',
      description: 'Verify mobile layout optimizations'
    },
    {
      taskName: 'Task 6: Visual Regression & Accessibility',
      testFile: 'tests/tasks/testVisualRegressionAccessibility.ts',
      description: 'Ensure accessibility and visual regression tests pass'
    },
    {
      taskName: 'Task 8: Bundle Optimization',
      testFile: 'tests/tasks/testBundleOptimization.ts',
      description: 'Verify code splitting and bundle optimization'
    },
    {
      taskName: 'Task 9: Accessibility & Mobile Responsiveness',
      testFile: 'tests/tasks/testAccessibilityAndResponsive.ts',
      description: 'Ensure accessibility and mobile responsiveness features'
    },
    {
      taskName: 'Accessibility Implementation Verification',
      testFile: 'tests/tasks/verifyAccessibilityImplementation.ts',
      description: 'Verify accessibility implementation completeness'
    },
    {
      taskName: 'Task Completion Persistence',
      testFile: 'tests/tasks/task-completion.test.ts',
      description: 'Ensure completed tasks remain marked as completed'
    }
  ]

  async runTaskTest(taskTest: typeof this.taskTests[0]): Promise<TaskTestResult> {
    const startTime = Date.now()
    const { taskName, testFile, description } = taskTest

    console.log(`\n🧪 Running ${taskName}...`)
    console.log(`   📄 ${description}`)

    if (!existsSync(testFile)) {
      console.log(`⚠️  Test file not found: ${testFile}`)
      return {
        taskName,
        testFile,
        passed: false,
        duration: Date.now() - startTime,
        output: `Test file not found: ${testFile}`
      }
    }

    return new Promise((resolve) => {
      const child = spawn('bun', [testFile], {
        stdio: 'pipe',
        shell: true
      })

      let output = ''
      
      child.stdout?.on('data', (data) => {
        output += data.toString()
      })
      
      child.stderr?.on('data', (data) => {
        output += data.toString()
      })

      child.on('close', (code) => {
        const duration = Date.now() - startTime
        const passed = code === 0
        
        if (passed) {
          console.log(`✅ ${taskName} - PASSED (${duration}ms)`)
        } else {
          console.log(`❌ ${taskName} - FAILED (${duration}ms)`)
          console.log(`   Output: ${output.slice(-200)}`) // Show last 200 chars
        }
        
        resolve({
          taskName,
          testFile,
          passed,
          duration,
          output
        })
      })
    })
  }

  async runVitest(testFile: string): Promise<TaskTestResult> {
    const startTime = Date.now()
    const taskName = `Vitest: ${testFile}`

    console.log(`\n🧪 Running ${taskName}...`)

    return new Promise((resolve) => {
      const child = spawn('vitest', ['run', testFile], {
        stdio: 'pipe',
        shell: true
      })

      let output = ''
      
      child.stdout?.on('data', (data) => {
        output += data.toString()
      })
      
      child.stderr?.on('data', (data) => {
        output += data.toString()
      })

      child.on('close', (code) => {
        const duration = Date.now() - startTime
        const passed = code === 0
        
        if (passed) {
          console.log(`✅ ${taskName} - PASSED (${duration}ms)`)
        } else {
          console.log(`❌ ${taskName} - FAILED (${duration}ms)`)
          console.log(`   Output: ${output.slice(-200)}`)
        }
        
        resolve({
          taskName,
          testFile,
          passed,
          duration,
          output
        })
      })
    })
  }

  printSummary() {
    const totalDuration = Date.now() - this.startTime
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    
    console.log('\n' + '='.repeat(80))
    console.log('📊 KIRO\'S TASK TESTS SUMMARY')
    console.log('='.repeat(80))
    
    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      const duration = `${result.duration}ms`
      console.log(`${status} ${result.taskName.padEnd(50)} ${duration.padStart(8)}`)
    })
    
    console.log('='.repeat(80))
    console.log(`Total Tests: ${this.results.length} | Passed: ${passed} | Failed: ${failed}`)
    console.log(`Total Duration: ${totalDuration}ms`)
    
    if (failed > 0) {
      console.log('\n❌ Some task tests failed!')
      console.log('This indicates that completed tasks may have regressed.')
      console.log('Please review the failed tests and ensure completed tasks remain functional.')
      
      const failedTests = this.results.filter(r => !r.passed)
      console.log('\nFailed Tests:')
      failedTests.forEach(test => {
        console.log(`  - ${test.taskName}`)
        console.log(`    File: ${test.testFile}`)
      })
      
      process.exit(1)
    } else {
      console.log('\n🎉 All task tests passed!')
      console.log('✅ All completed tasks remain functional and properly implemented.')
      process.exit(0)
    }
  }

  async run() {
    console.log('🚀 Starting Kiro\'s Task Tests for Zuno Learning Platform')
    console.log('🎯 Purpose: Ensure completed tasks stay completed across sessions')
    console.log(`📁 Running ${this.taskTests.length} task-specific tests...\n`)

    try {
      // Run task completion test first (using Vitest)
      this.results.push(await this.runVitest('tests/tasks/task-completion.test.ts'))

      // Run all task-specific tests
      for (const taskTest of this.taskTests.filter(t => t.testFile !== 'tests/tasks/task-completion.test.ts')) {
        this.results.push(await this.runTaskTest(taskTest))
      }
      
    } catch (error) {
      console.error('❌ Task test runner encountered an error:', error)
      process.exit(1)
    }

    this.printSummary()
  }
}

// Run the task test suite
const runner = new TaskTestRunner()
runner.run().catch(console.error)