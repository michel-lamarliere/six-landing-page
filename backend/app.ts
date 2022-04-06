import express from 'express';
import bodyParser from 'body-parser';

const database = require('./util/db-connect');
const userRoutes = require('./routes/user-routes');
const userModifyRoutes = require('./routes/user-modify-routes');
const logRoutes = require('./routes/log-routes');
const chartsRoutes = require('./routes/charts-routes');

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

app.use('/api/user', userRoutes);
app.use('/api/user-modify', userModifyRoutes);
app.use('/api/log', logRoutes);
app.use('/api/charts', chartsRoutes);

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
		res.status(400).json({ message: error.message });
	}
);
