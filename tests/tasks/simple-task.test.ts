import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'

describe('Simple Task Verification', () => {
  it('should have package.json with correct name', () => {
    const packagePath = join(process.cwd(), 'package.json')
    expect(existsSync(packagePath)).toBe(true)
    
    const packageJson = require(packagePath)
    expect(packageJson.name).toBe('zuno-learning-app')
  })

  it('should have src directory structure', () => {
    const srcPath = join(process.cwd(), 'src')
    expect(existsSync(srcPath)).toBe(true)
    
    const componentsPath = join(srcPath, 'components')
    expect(existsSync(componentsPath)).toBe(true)
    
    const utilsPath = join(srcPath, 'utils')
    expect(existsSync(utilsPath)).toBe(true)
  })

  it('should have test files in proper locations', () => {
    // Check for unit tests alongside source
    const utilsTestPath = join(process.cwd(), 'src/utils/simple.test.ts')
    expect(existsSync(utilsTestPath)).toBe(true)
    
    const componentTestPath = join(process.cwd(), 'src/components/ui/simple-button.test.tsx')
    expect(existsSync(componentTestPath)).toBe(true)
    
    // Check for E2E tests in tests directory
    const e2eTestPath = join(process.cwd(), 'tests/e2e/simple.spec.ts')
    expect(existsSync(e2eTestPath)).toBe(true)
  })

  it('should have proper test scripts in package.json', () => {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = require(packagePath)
    
    expect(packageJson.scripts).toBeDefined()
    expect(packageJson.scripts['test']).toBeDefined()
    expect(packageJson.scripts['test:unit']).toBeDefined()
    expect(packageJson.scripts['test:e2e']).toBeDefined()
    expect(packageJson.scripts['test:tasks']).toBeDefined()
    expect(packageJson.scripts['test:all']).toBeDefined()
  })

  it('should have testing dependencies installed', () => {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = require(packagePath)
    
    const devDeps = packageJson.devDependencies || {}
    
    expect(devDeps['vitest']).toBeDefined()
    expect(devDeps['@testing-library/react']).toBeDefined()
    expect(devDeps['@testing-library/user-event']).toBeDefined()
    expect(devDeps['@playwright/test']).toBeDefined()
  })
})