import { RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import {
	addHours,
	addMonths,
	getMonth,
	isBefore,
	isAfter,
	isSameMonth,
	getDaysInMonth,
} from 'date-fns';

const database = require('../util/db-connect');

const getAnnual: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	// const reqYear = +req.params.year;
	const reqYear = 2021;
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
	}

	const firstDateOfYear = addHours(new Date(reqYear, 0, 1), 1);

	console.log(firstDateOfYear);
	const lastDateOfYear = new Date(reqYear, 11, 31);

	const months = [];

	for (let i = 0; i < 12; i++) {
		if (isBefore(addMonths(firstDateOfYear, i), new Date())) {
			months.push(i);
		}
		console.log(addMonths(firstDateOfYear, i));
		console.log(getMonth(new Date()));
	}

	console.log(months);

	res.status(200).json({ success: 'Succès.' });

	// for (let i = 0; i < 12; i++) {
	// 	for (let y = 0; y < getDaysInMonth(firstDateOfYear); y++) {
	// 		if (isSameDay(matchedArray[y], firstDateOfYear ))
	// 	}
	// }

	// for (let i = 0; i < user.log.length; i++) {

	// }
};

exports.getAnnual = getAnnual;
