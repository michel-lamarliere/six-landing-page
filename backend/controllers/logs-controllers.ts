import { log } from 'console';
import { query, RequestHandler } from 'express';
const { MongoClient } = require('mongodb');

const addData: RequestHandler = async (req, res, next) => {
	const {
		userEmail: reqUserEmail,
		date: reqDate,
		task: reqTask,
		levelOfCompletion: reqLevelOfCompletion,
	} = await req.body;

	const client = new MongoClient(process.env.SERVER_URI);

	// DB CONNECTION
	await client.connect();
	const database = await client.db('six-dev');
	const testCollection = await database.collection('test');

	// USER QUERY
	const filter = {
		email: reqUserEmail,
	};

	// FINDING THE USER
	let user;
	try {
		user = await testCollection.findOne(filter);
		if (user === null) {
			throw new Error('User not found');
		}
	} catch (error) {
		return next(error);
	}

	// ADDING THE SIX TO THE USER
	const update = {
		$set: {
			log: [
				{
					date: reqDate,
					six: {
						[reqTask]: reqLevelOfCompletion,
					},
				},
			],
		},
	};
	await testCollection.update(filter, update, { upsert: true });

	let updatedUser = await testCollection.findOne(filter);

	// END
	res.json({ message: 'success', updatedUser });
	await client.close();
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const {
		userEmail: reqUserEmail,
		startDate: reqStartDate,
		endDate: reqEndDate,
	} = await req.body;

	const client = new MongoClient(process.env.SERVER_URI);

	// DB CONNECTION
	await client.connect();
	const database = await client.db('six-dev');
	const testCollection = await database.collection('test');

	const query = {
		email: reqUserEmail,
	};

	let user;
	try {
		user = testCollection.findOne(query);
		if (!user) {
			throw new Error('User not found.');
		}
	} catch (error) {
		next(error);
	}

	// END
	res.json({ message: 'success' });
	await client.close();
};

exports.addData = addData;
exports.getWeekly = getWeekly;
