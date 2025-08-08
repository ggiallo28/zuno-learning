#!/usr/bin/env node

// Import and configure Amplify
import { Amplify } from 'aws-amplify';
import config from '../src/amplifyconfiguration.json' assert { type: 'json' };

Amplify.configure(config);

// Import and run seeding
import { seedDatabase } from '../src/scripts/seedData.ts';

seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });