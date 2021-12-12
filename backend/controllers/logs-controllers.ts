import { RequestHandler } from 'express';
const { MongoClient } = require('mongodb');

const addData: RequestHandler = async (req, res, next) => {
	const { ntoken, ndate, ntask, nlevelOfCompletion } = await req.body;

	const client = new MongoClient(process.env.SERVER_URI);

	// DECODE TOKEN
	let userEmail = 'michel@test.com';
	let date = '2021-12-12';
	let task = 'sleep';
	let levelOfCompletion = 2;

	try {
		await client.connect();
		const database = await client.db('six-dev');
		const testCollection = await database.collection('test');

		const query = {
			email: userEmail,
		};

		let user = await testCollection.findOne(query);

		let newTask = await testCollection.insertOne();
	} finally {
		await client.close();
	}

	res.json({ message: 'success' });
};

exports.addData = addData;
