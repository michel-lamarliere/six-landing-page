import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const signUp: RequestHandler = async (req, res, next) => {
	const { name, email, password } = await req.body;

	// HASHING PASSWORD
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
		log: {},
	};

	const client = new MongoClient(process.env.SERVER_URI);

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
	await client.connect();
	const database = await client.db('six-dev');
	const testCollection = await database.collection('test');
	const query = {
		email,
	};
	let user = await testCollection.findOne(query);
	id = await user._id.toString();

	// CREATES TOKEN
	let token;
	try {
		token = await jwt.sign({ id: id, email: email }, 'je-mange-du-pain-blanc-enola', {
			expiresIn: '1h',
		});
	} catch (error) {
		console.log(error);
	}

	// END
	res.json({ token, id, name, email });
	await client.close();
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body;

	const client = new MongoClient(process.env.SERVER_URI);

	let existingUser;
	let token;

	// CONNECTING TO DB
	await client.connect();
	const database = await client.db('six-dev');
	const testCollection = await database.collection('test');

	// FINDING USER
	const query = {
		email,
	};
	const result = await testCollection.findOne(query);
	let samePasswords = false;
	// COMPARING ENTERED PASSWORD AND HASHED PASSWORD
	try {
		samePasswords = await bcrypt.compare(password, result.password);
	} catch (error) {
		throw new Error('Something went wrong when comparing password');
	}

	if (samePasswords) {
		console.log('logged in');
		existingUser = {
			id: result._id.toString(),
			name: result.name,
			email: email,
		};
	} else {
		throw new Error('Incorrect password, please try again.');
	}

	token = await jwt.sign(
		{ userId: existingUser.id, email: existingUser.email },
		'je-mange-du-pain-blanc-enola',
		{
			expiresIn: '1h',
		}
	);

	// END
	res.json({
		token: token,
		id: existingUser.id,
		name: existingUser.name,
		email: existingUser.email,
	});
	await client.close();
};

exports.signUp = signUp;
exports.signIn = signIn;
