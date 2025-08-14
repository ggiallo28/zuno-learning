#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') && !item.includes('.d.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function fixUnusedReactImport(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check if file has unused React import
    const hasUnusedReactImport = content.includes('import * as React from "react";') || 
                                 content.includes('import React from "react";');
    
    if (!hasUnusedReactImport) return false;
    
    // Check if React is actually used (hooks, React.something, etc.)
    const usesReact = content.includes('React.') || 
                     content.includes('useState') ||
                     content.includes('useEffect') ||
                     content.includes('useContext') ||
                     content.includes('useReducer') ||
                     content.includes('useMemo') ||
                     content.includes('useCallback') ||
                     content.includes('useRef') ||
                     content.includes('useImperativeHandle') ||
                     content.includes('useLayoutEffect') ||
                     content.includes('useDebugValue');
    
    if (usesReact) return false;
    
    // Remove unused React import
    let newContent = content
      .replace(/import \* as React from "react";\n/g, '')
      .replace(/import React from "react";\n/g, '');
    
    // Clean up any double newlines
    newContent = newContent.replace(/\n\n\n/g, '\n\n');
    
    if (newContent !== content) {
      writeFileSync(filePath, newContent, 'utf-8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Fix all files in src/components
const componentFiles = getAllTsxFiles('src/components');
let fixedCount = 0;

for (const file of componentFiles) {
  if (fixUnusedReactImport(file)) {
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files with unused React imports`);