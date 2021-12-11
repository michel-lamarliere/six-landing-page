import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

const { MongoClient } = require('mongodb');

const signUp: RequestHandler = async (req, res, next) => {
	const { name, email, password } = await req.body;

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (error) {
		console.log('password hash failed');
	}

	const newUser = {
		name,
		email,
		password: hashedPassword,
	};

	const uri =
		'mongodb+srv://michel:OJzkF3ALZkZeAoWh@cluster0.oy9ya.mongodb.net/test?retryWrites=true&w=majority';
	const client = new MongoClient(uri);

	// CHECKS IF EMAIL ADDRESS IS ALREADY IN USE
	try {
		await client.connect();
		const database = await client.db('six-dev');
		const testCollection = await database.collection('test');
		const query = {
			email,
		};
		let user = await testCollection.findOne(query);
		if (user) {
			console.log('email address already exists, please log in');
			return;
		}
	} finally {
		await client.close();
	}

	// CREATES NEW USER
	try {
		await client.connect();
		const database = await client.db('six-dev');
		const testCollection = await database.collection('test');

		await testCollection.insertOne(newUser);
	} finally {
		await client.close();
	}

	// LOGS IN NEW USER
	let id;
	try {
		await client.connect();
		const database = await client.db('six-dev');
		const testCollection = await database.collection('test');
		const query = {
			email,
		};
		let user = await testCollection.findOne(query);
		id = await user._id.toString();
	} finally {
		await client.close();
	}

	res.json({ id, name, email });
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
		let samePasswords = false;
		try {
			samePasswords = await bcrypt.compare(password, result.password);
		} catch (error) {
			return;
		}
		if (samePasswords) {
			console.log('logged in');
			foundUser = {
				id: result._id.toString(),
				name: result.name,
				email: email,
			};
		} else {
			console.log('wrong credentials');
			return;
		}
	} finally {
		await client.close();
	}

	res.json(foundUser);
};

exports.signUp = signUp;
exports.signIn = signIn;
