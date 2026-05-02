import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	baseURL: 'http://localhost:5173',
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema
	}),
	emailAndPassword: {
		enabled: true
	}
});
