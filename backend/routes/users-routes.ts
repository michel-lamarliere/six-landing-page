import { Router } from 'express';
const { MongoClient } = require('mongodb');

const router = Router();

const USERS: {
	id: number;
	name: string;
	email: string;
	password: string;
}[] = [
	// {
	// 	name: 'Michel',
	// 	email: 'michel@test.com',
	// },
	// {
	// 	name: 'Enola',
	// 	email: 'enola@test.com',
	// },
];

router.post('/signin', (req, res, next) => {
	const { email, password } = req.body;

	res.json({ email, password });
});

router.post('/signup', async (req, res, next) => {
	const { id, name, email, password } = await req.body;
	USERS.push({ id, name, email, password });

	const uri =
		'mongodb+srv://michel:OJzkF3ALZkZeAoWh@cluster0.oy9ya.mongodb.net/test?retryWrites=true&w=majority';
	const client = new MongoClient(uri);

	const runServer = async () => {
		try {
			await client.connect();
			const database = await client.db('six-dev');
			const test = await database.collection('test');
			const user = {
				name,
				email,
				password,
			};
			const result = await test.insertOne(user);
		} finally {
			await client.close();
		}
	};
	runServer();

	const result = await res.json({ id, name, email, password });
	console.log(USERS);
});

router.get('/', async (req, res, next) => {
	console.log(USERS);
	let users = await USERS.map((user) => user);
	res.json({ users });
});

module.exports = router;
