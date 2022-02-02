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
	getYear,
	isSameDay,
} from 'date-fns';

const database = require('../util/db-connect');

const getAnnual: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqYear: number = +req.params.year;
	const reqTask = req.params.task;

	console.log(reqYear);
	console.log(reqTask);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
	}

	const firstDateOfYear = addHours(new Date(reqYear, 0, 1), 1);

	const thisYearsData = [];

	for (let i = 0; i < user.log.length; i++) {
		if (getYear(user.log[i].date) === reqYear && user.log[i].six[reqTask] !== 0) {
			const data = { date: user.log[i].date, data: user.log[i].six[reqTask] };
			thisYearsData[thisYearsData.length] = data;
		}
	}

	const sortingFn = (a: { date: Date }, b: { date: Date }) => {
		if (isBefore(a.date, b.date)) {
			return -1;
		} else {
			return 1;
		}
	};

	thisYearsData.sort(sortingFn);

	const months = [];

	for (let i = 0; i < 12; i++) {
		if (isBefore(addMonths(firstDateOfYear, i), new Date())) {
			months.push(i);
		}
	}

	let responseArray: any = {};

	for (let i = 0; i < months.length; i++) {
		const monthLength = getDaysInMonth(new Date(reqYear, months[i], 1));
		const allDataInMonth: {}[] = [];

		for (let y = 1; y < monthLength + 1; y++) {
			let sameDate = false;
			for (let x = 0; x < thisYearsData.length; x++) {
				if (
					isSameDay(thisYearsData[x].date, addHours(new Date(reqYear, i, y), 1))
				) {
					allDataInMonth.push(thisYearsData[x]);
					sameDate = true;
				}
			}
			// STOP AFTER TODAY'S DATE
			if (!sameDate && isBefore(addHours(new Date(reqYear, i, y), 1), new Date())) {
				const data = {
					date: addHours(new Date(reqYear, i, y), 1),
					data: 0,
				};
				allDataInMonth.push(data);
			}
		}
		responseArray[i] = allDataInMonth;
	}

	console.log('responseArray');
	console.log(responseArray);

	res.status(200).json({ success: 'Succès.', responseArray });
};

exports.getAnnual = getAnnual;
