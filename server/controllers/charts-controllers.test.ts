import { ObjectId } from 'mongodb';

const request = require('supertest');
const database = require('../utils/db-connect');
const app = require('../app');

describe('GET /annual', () => {
	beforeAll(async () => {
		await database.getDb().collection('users');
		// console.log('hello');
	});

	describe('when the user id, year and task exist', () => {
		test('should respond with a 200 status code', async () => {
			const userId = '626042add7177bed136b84b1';
			const reqYear = '2022';
			const reqTask = 'nutrition';

			const { statusCode, body } = await request(app)
				.get(`/api/charts/annual`)
				.send({ id: userId, year: reqYear, task: reqTask });

			// const { statusCode, body } = await request(app).get(
			// 	`/api/charts/annual/${userId}/${reqYear}/${reqTask}`
			// );

			expect(statusCode).toBe(200);
		});
	});

	describe("when the user id doesn't exist", () => {
		test('should respond with a 403 status code', async () => {
			const userId = 'null';
			const reqYear = 'null';
			const reqTask = 'null';

			const { statusCode, body } = await request(app).get(
				`/api/charts/annual/${userId}/${reqYear}/${reqTask}`
			);

			expect(statusCode).toBe(403);
			expect(body.fatal).toBeTruthy();
		});
	});
	// should res 200
	// should res a body with success and a results array
});
