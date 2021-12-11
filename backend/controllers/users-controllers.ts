import { RequestHandler } from 'express';

const { MongoClient } = require('mongodb');

const signUp: RequestHandler = async (req, res, next) => {
	const { name, email, password } = await req.body;

	const uri =
		'mongodb+srv://michel:OJzkF3ALZkZeAoWh@cluster0.oy9ya.mongodb.net/test?retryWrites=true&w=majority';
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const database = await client.db('six-dev');
		const testCollection = await database.collection('test');
		const user = {
			name,
			email,
			password,
		};
		const result = await testCollection.insertOne(user);
	} finally {
		await client.close();
	}

	res.json({ name, email, password });
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body;

	const uri =
		'mongodb+srv://michel:OJzkF3ALZkZeAoWh@cluster0.oy9ya.mongodb.net/test?retryWrites=true&w=majority';
	const client = new MongoClient(uri);

	let foundUser;
	try {
		await client.connect();
		const database = await client.db('six-dev');
		const testCollection = await database.collection('test');
		const query = {
			email,
		};
		const result = await testCollection.findOne(query);
		if (result && password === result.password) {
			console.log('logged in');
			console.log(result);
			foundUser = {
				id: result._id.toString(),
				name: result.name,
				email: email,
			};
		} else {
			console.log('wrong credentials');
		}
	} finally {
		await client.close();
	}

	res.json(foundUser);
};

exports.signUp = signUp;
exports.signIn = signIn;