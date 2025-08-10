import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/app': path.resolve(__dirname, './src/app')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Set reasonable chunk size warning limit (200kb for vendor, smaller for app code)
    chunkSizeWarningLimit: 200,
    // Additional optimizations
    target: 'es2020', // Modern target for better optimization
    cssCodeSplit: true, // Split CSS into separate files
    assetsInlineLimit: 4096, // Inline small assets
    // Enable more aggressive minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better compression
        unsafe: true, // More aggressive optimizations
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true
      },
      mangle: {
        safari10: true // Better Safari compatibility
      }
    },
    rollupOptions: {
      // Enable tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      },
      output: {
        // Manual chunks for better code splitting - optimized to avoid empty chunks
        manualChunks: (id) => {
          // Skip if not a real module
          if (!id || id.includes('\0')) return;
          // Vendor chunks with aggressive splitting for large libraries
          if (id.includes('node_modules')) {
            // React ecosystem - optimized splitting to avoid empty chunks
            if (id.includes('react-dom/client')) {
              return 'vendor-react-dom-client';
            }
            if (id.includes('react-dom/server')) {
              return 'vendor-react-dom-server';
            }
            if (id.includes('react-dom') && !id.includes('react-dom/client') && !id.includes('react-dom/server')) {
              return 'vendor-react-dom-core';
            }
            // Consolidate all React Router into one chunk to avoid empty chunks
            if (id.includes('react-router')) {
              return 'vendor-react-router';
            }
            if (id.includes('react/jsx-runtime') || id.includes('react/jsx-dev-runtime')) {
              return 'vendor-react-jsx';
            }
            if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router') && !id.includes('react/jsx')) {
              return 'vendor-react-core';
            }

            // AWS Amplify - balanced splitting to avoid empty chunks
            if (id.includes('amazon-cognito-identity-js')) {
              return 'vendor-cognito';
            }
            if (id.includes('aws-amplify/lib-esm/Auth') || id.includes('aws-amplify/lib-esm/Core')) {
              return 'vendor-aws-auth-core';
            }
            if (id.includes('aws-amplify/lib-esm/API') || id.includes('aws-amplify/lib-esm/GraphQL')) {
              return 'vendor-aws-api';
            }
            if (id.includes('aws-amplify/lib-esm/Storage')) {
              return 'vendor-aws-storage';
            }
            if (id.includes('aws-amplify/lib-esm/Hub') || 
                id.includes('aws-amplify/lib-esm/Logger') || 
                id.includes('aws-amplify/lib-esm/Common') ||
                id.includes('aws-amplify/lib-esm/Util')) {
              return 'vendor-aws-utils';
            }
            if (id.includes('aws-amplify') && !id.includes('@aws-amplify/ui-react')) {
              return 'vendor-aws-misc';
            }
            if (id.includes('@aws-amplify/ui-react')) {
              return 'vendor-aws-ui';
            }

            // Radix UI - split by component groups
            if (id.includes('@radix-ui/react-dialog') ||
              id.includes('@radix-ui/react-tabs')) {
              return 'vendor-ui-overlays';
            }
            if (id.includes('@radix-ui/react-select') ||
              id.includes('@radix-ui/react-radio-group') ||
              id.includes('@radix-ui/react-checkbox')) {
              return 'vendor-ui-forms';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui-misc';
            }

            // Form libraries
            if (id.includes('react-hook-form')) {
              return 'vendor-forms-rhf';
            }
            if (id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'vendor-forms-validation';
            }

            // Icons - separate large icon libraries
            if (id.includes('lucide-react')) {
              return 'vendor-icons-lucide';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons-react';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-visual-effects';
            }

            // Utility libraries
            if (id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')) {
              return 'vendor-utils-css';
            }

            // Date libraries
            if (id.includes('react-day-picker')) {
              return 'vendor-date';
            }

            // Split other potentially large libraries
            if (id.includes('@uibakery/data')) {
              return 'vendor-uibakery';
            }

            // Other vendor libraries
            return 'vendor-misc';
          }

          // App chunks based on functionality
          if (id.includes('/auth/')) {
            return 'auth';
          }
          if (id.includes('CourseCatalog') ||
            id.includes('LessonViewer') ||
            id.includes('AssessmentSystem')) {
            return 'learning';
          }
          if (id.includes('Coach') ||
            id.includes('Onboarding') ||
            id.includes('Adaptive')) {
            return 'coaching';
          }
          if (id.includes('/actions/')) {
            return 'actions';
          }
          if (id.includes('/contexts/')) {
            return 'contexts';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'aws-amplify',
      '@aws-amplify/ui-react',
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ]
  },
  define: {
    global: 'globalThis'
  }
})
