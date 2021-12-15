import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
const database = require('./util/db-connect');

const userRoutes = require('./routes/users-routes');
const logsRoutes = require('./routes/logs-routes');

const app = express();

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

app.use('/api/users', userRoutes);
app.use('/api/logs', logsRoutes);

app.listen(8080, () => {
	database.connectToServer((error: {}) => {
		if (error) console.error(error);
	});
	console.log('listening on port 8080');
});

// ERROR HANDLING: RETURN IN JSON FORMAT
app.use(
	(
		error: { message: string },
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		res.json({ message: error.message });
	}
);
