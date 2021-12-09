import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const USERS: {
	name: string;
	email: string;
}[] = [
	{
		name: 'Michel',
		email: 'michel@test.com',
	},
	{
		name: 'Enola',
		email: 'enola@test.com',
	},
];

app.use('/', bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

app.post('/api/login', (req, res, next) => {
	const { email, password } = req.body;

	res.json({ email, password });
});

app.post('/api/signup', (req, res, next) => {
	const { name, email } = req.body;
	USERS.push({ name, email });

	res.json({ name, email });
	console.log(USERS);
});

app.get('/api/users/', async (req, res, next) => {
	console.log(USERS);
	let users = await USERS.map((user) => user);
	res.json({ users });
});

app.listen(8080, () => {
	console.log('listening on port 8080');
});
