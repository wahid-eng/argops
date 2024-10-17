import request from 'supertest';
import app from '../src/index'; // Ensure index.ts is exporting app
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const userId = Date.now();

afterAll(async () => {
	await mongoose.connection.close();
});

describe('Auth API', () => {
	it('should register a user', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({
				username: 'testuser',
				email: `testuser+${userId}@example.com`,
				password: 'password',
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body.message).toBe('User registered successfully');
	});

	it('should log in a user', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({
				email: `testuser+${userId}@example.com`,
				password: 'password',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body.token).toBeDefined();
	});

	it('should not log in a user with invalid credentials', async () => {
		const res = await request(app).post('/api/auth/login').send({
			email: `testuser@example.com`,
			password: 'wrongpassword',
		});
		expect(res.statusCode).toEqual(401);
		expect(res.body.message).toBe('Invalid credentials');
	});
});
