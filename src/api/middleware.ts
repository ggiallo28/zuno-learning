import { Plugin } from 'vite';
import api from './server';

// Custom plugin to use our Express app as middleware
export const apiMiddleware = (): Plugin => ({
  name: 'api-middleware',
  configureServer(server) {
    server.middlewares.use('/api', api);
  },
});
