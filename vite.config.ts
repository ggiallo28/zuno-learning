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
    sourcemap: 'hidden', // Generate source maps but don't reference them in built files
    chunkSizeWarningLimit: 300, // Increase limit for vendor chunks
    target: 'es2020', // Modern target for better optimization
    cssCodeSplit: true, // Split CSS into separate files
    assetsInlineLimit: 4096, // Inline small assets (4KB limit)
    assetsDir: 'assets', // Keep assets in assets directory
    emptyOutDir: true, // Clean dist directory before build
    // Enable more aggressive minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Multiple passes for better compression
        unsafe: false, // Keep safe for production
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_methods: false,
        // Remove unused code more aggressively
        dead_code: true,
        unused: true,
        // Optimize conditionals
        conditionals: true,
        evaluate: true,
        // Optimize loops
        loops: true,
        // Optimize sequences
        sequences: true
      },
      mangle: {
        safari10: true, // Better Safari compatibility
        properties: false // Don't mangle properties for safety
      },
      format: {
        comments: false // Remove all comments
      }
    },
    rollupOptions: {
      // Enable aggressive tree shaking
      treeshake: {
        moduleSideEffects: (id) => {
          // Allow side effects for CSS and some specific modules
          return id.includes('.css') || id.includes('aws-amplify') || id.includes('polyfill');
        },
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      },
      external: [],
      output: {
        // CDN-friendly file naming with content hashes
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Optimized manual chunks for better caching and loading
        manualChunks: (id) => {
          // Skip if not a real module
          if (!id || id.includes('\0')) return;
          
          // Vendor chunks with optimized splitting
          if (id.includes('node_modules')) {
            // React ecosystem - core React functionality
            if (id.includes('react/jsx-runtime') || id.includes('react/jsx-dev-runtime')) {
              return 'vendor-react-jsx';
            }
            if (id.includes('react-dom/client')) {
              return 'vendor-react-dom-client';
            }
            if (id.includes('react-dom') && !id.includes('react-dom/client')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react-router')) {
              return 'vendor-react-router';
            }
            if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router') && !id.includes('react/jsx')) {
              return 'vendor-react';
            }

            // AWS Amplify - more granular splitting for better caching
            if (id.includes('amazon-cognito-identity-js') || id.includes('@aws-crypto')) {
              return 'vendor-aws-cognito';
            }
            if (id.includes('aws-amplify/auth') || id.includes('aws-amplify/lib-esm/Auth')) {
              return 'vendor-aws-auth';
            }
            if (id.includes('aws-amplify/api') || id.includes('aws-amplify/lib-esm/API') || id.includes('aws-amplify/lib-esm/GraphQL')) {
              return 'vendor-aws-api';
            }
            if (id.includes('aws-amplify/storage') || id.includes('aws-amplify/lib-esm/Storage')) {
              return 'vendor-aws-storage';
            }
            if (id.includes('aws-amplify/lib-esm/Core') || 
                id.includes('aws-amplify/lib-esm/Hub') ||
                id.includes('aws-amplify/lib-esm/Logger') ||
                id.includes('aws-amplify/lib-esm/Common') ||
                id.includes('aws-amplify/lib-esm/Util')) {
              return 'vendor-aws-core';
            }
            // Catch remaining AWS Amplify modules
            if (id.includes('aws-amplify') && !id.includes('@aws-amplify/ui-react')) {
              return 'vendor-aws-misc';
            }
            if (id.includes('@aws-amplify/ui-react')) {
              return 'vendor-aws-ui';
            }

            // UI Libraries - group by functionality
            if (id.includes('@radix-ui/react-dialog') ||
                id.includes('@radix-ui/react-tabs') ||
                id.includes('@radix-ui/react-popover') ||
                id.includes('@radix-ui/react-tooltip')) {
              return 'vendor-ui-overlays';
            }
            if (id.includes('@radix-ui/react-select') ||
                id.includes('@radix-ui/react-radio-group') ||
                id.includes('@radix-ui/react-checkbox') ||
                id.includes('@radix-ui/react-switch')) {
              return 'vendor-ui-forms';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui-base';
            }

            // Form handling
            if (id.includes('react-hook-form')) {
              return 'vendor-forms';
            }
            if (id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'vendor-validation';
            }

            // Icons and visual effects
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-effects';
            }

            // Utility libraries
            if (id.includes('class-variance-authority') ||
                id.includes('clsx') ||
                id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }

            // Charts and data visualization
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }

            // Date handling
            if (id.includes('react-day-picker')) {
              return 'vendor-date';
            }

            // Other large libraries
            if (id.includes('@uibakery/data')) {
              return 'vendor-data';
            }

            // Remaining vendor code
            return 'vendor-misc';
          }

          // App chunks based on functionality
          if (id.includes('/auth/') || id.includes('AuthFlow') || id.includes('SignIn') || id.includes('SignUp')) {
            return 'app-auth';
          }
          if (id.includes('CourseCatalog') ||
              id.includes('LessonViewer') ||
              id.includes('AssessmentSystem') ||
              id.includes('QuizSystem')) {
            return 'app-learning';
          }
          if (id.includes('Coach') ||
              id.includes('Onboarding') ||
              id.includes('Adaptive')) {
            return 'app-coaching';
          }
          if (id.includes('/actions/')) {
            return 'app-actions';
          }
          if (id.includes('/contexts/')) {
            return 'app-contexts';
          }
          if (id.includes('/components/ui/')) {
            return 'app-ui';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      // Core dependencies that should be pre-bundled
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'lucide-react',
      // AWS Amplify core modules
      'aws-amplify/auth',
      'aws-amplify/api',
      '@aws-amplify/ui-react',
      // UI libraries
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      // Form libraries
      'react-hook-form',
      'zod'
    ],
    exclude: [
      // Large libraries that should be chunked separately
      'aws-amplify',
      'amazon-cognito-identity-js',
      'canvas-confetti',
      'recharts'
    ]
  },
  define: {
    global: 'globalThis',
    // Define environment variables for better tree shaking
    __DEV__: JSON.stringify(false),
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  // Enable experimental features for better optimization
  esbuild: {
    // Remove console logs and debugger statements
    drop: ['console', 'debugger'],
    // Enable more aggressive minification
    legalComments: 'none',
    // Target modern browsers for better optimization
    target: 'es2020'
  }
})
