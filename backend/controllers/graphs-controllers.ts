import { RequestHandler } from 'express';
import { ObjectId } from 'mongodb';

const database = require('../util/db-connect');

const getAnnual: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqYear = +req.params.year;
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
	}

	const firstDateOfYear = new Date(reqYear, 1, 1);
	const lastDateOfYear = new Date(reqYear, 12, 31);

	for (let i = 0; i < user.log.length; i++) {}
};

exports.getAnnual = getAnnual;
