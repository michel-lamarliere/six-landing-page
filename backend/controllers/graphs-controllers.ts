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
	const reqYear = 2022;
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
	}

	const firstDateOfYear = addHours(new Date(reqYear, 0, 1), 1);

	console.log(firstDateOfYear);
	const lastDateOfYear = new Date(reqYear, 11, 31);

	const orderedLog: [] = [];

	for (let i = 0; i < user.log.length; i++) {
		if (user.log[i].date.getYear() === reqYear) {
			for (let y = 0; y < orderedLog.length; y++) {
				if (isBefore(user.log[i].date, orderedLog[y])) {
					orderedLog.splice(y, 0, orderedLog[y]);
				}
			}
		}
	}

	console.log(orderedLog);

	const months = [];

	for (let i = 0; i < 12; i++) {
		if (isBefore(addMonths(firstDateOfYear, i), new Date())) {
			months.push(i);
		}
		console.log(addMonths(firstDateOfYear, i));
		console.log(getMonth(new Date()));
	}

	let searchArray: any = {};

	for (let i = 0; i < months.length; i++) {
		const monthLength = getDaysInMonth(new Date(reqYear, months[i], 1));
		const allDatesInMonth = [];

		for (let y = 1; y < monthLength + 1; y++) {
			allDatesInMonth.push(addHours(new Date(reqYear, i, y), 1));
		}
		searchArray[i] = allDatesInMonth;
	}

	console.log(searchArray);

	// for (let i = 0; i < searchArray.length; i++) {
	// 	if ()
	// }

	console.log(months);
	res.status(200).json({ success: 'Succès.' });
};

exports.getAnnual = getAnnual;
