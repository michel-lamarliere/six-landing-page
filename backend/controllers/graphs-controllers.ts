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

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
	}

	const firstDateOfYear = addHours(new Date(reqYear, 0, 1), 1);

	const thisYearsData = [];

	// IF THE USER'S DATA MATCHES THE REQUESTED YEAR,
	for (let i = 0; i < user.log.length; i++) {
		if (getYear(user.log[i].date) === reqYear && user.log[i].six[reqTask] !== 0) {
			const data = { date: user.log[i].date, data: user.log[i].six[reqTask] };
			thisYearsData.push(data);
		}
	}

	// SORTES THE DATES
	const sortingFn = (a: { date: Date }, b: { date: Date }) => {
		if (isBefore(a.date, b.date)) {
			return -1;
		} else {
			return 1;
		}
	};

	thisYearsData.sort(sortingFn);

	const allYearsMonths = [];

	// CREATES AN ARRAY OF ALL THE REQUESTED YEAR'S MONTHS
	// , IF THE MONTH IS AFTER THE TODAY'S MONTH, IT STOPS
	for (let i = 0; i < 12; i++) {
		if (isBefore(addMonths(firstDateOfYear, i), new Date())) {
			allYearsMonths.push(i);
		}
	}

	const finalData: any = [];

	for (let i = 0; i < allYearsMonths.length; i++) {
		const loopingMonthLength = getDaysInMonth(
			new Date(reqYear, allYearsMonths[i], 1)
		);
		const loopingMonthData = { empty: 0, half: 0, full: 0 };

		// LOOPS THOUGH THE LOOPING MONTH DATA
		for (let y = 1; y < loopingMonthLength + 1; y++) {
			const loopingDate = addHours(new Date(reqYear, i, y), 1);

			if (isBefore(loopingDate, new Date())) {
				let sameDate = false;

				// CHECKS IF THE LOOPING DATE'S DATA EXISTS
				for (let x = 0; x < thisYearsData.length; x++) {
					if (isSameDay(thisYearsData[x].date, loopingDate)) {
						sameDate = true;
						thisYearsData[x].data === 1
							? loopingMonthData.half++
							: loopingMonthData.full++;
					}
				}
				// IF THE LOOPING DATE DOESN'T EXIST
				if (!sameDate) {
					loopingMonthData.empty++;
				}
			}
		}
		// PUSHES THE LOOPING MONTH'S DATA TO THE WHOLE YEAR'S ARRAY
		finalData.push(loopingMonthData);
	}

	res.status(200).json({ success: 'Succès.', array: finalData });
};

exports.getAnnual = getAnnual;
