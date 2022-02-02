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

	const finalData: any = [];

	for (let i = 0; i < months.length; i++) {
		const monthLength = getDaysInMonth(new Date(reqYear, months[i], 1));
		const thisMonthData = { empty: 0, half: 0, full: 0 };

		for (let y = 1; y < monthLength + 1; y++) {
			const loopingDay = addHours(new Date(reqYear, i, y), 1);

			console.log(loopingDay);
			if (isBefore(loopingDay, new Date())) {
				let sameDate = false;

				for (let x = 0; x < thisYearsData.length; x++) {
					if (isSameDay(thisYearsData[x].date, loopingDay)) {
						// console.log(thisYearsData[x].data);
						sameDate = true;
						thisYearsData[x].data === 1
							? thisMonthData.half++
							: thisMonthData.full++;
					}
				}
				if (!sameDate) {
					thisMonthData.empty++;
				}
			}
		}
		finalData.push({ [i]: thisMonthData });
	}

	console.log('finalData');
	console.log(finalData);

	const expectedResult = {
		'0': { empty: 23, half: 7, full: 1 },
		'1': { empty: 1, half: 0, full: 1 },
	};

	console.log('expectedResult');
	console.log(expectedResult);

	// console.log('completeArray');
	// console.log(completeArray);

	res.status(200).json({ success: 'Succès.', array: finalData });
};

exports.getAnnual = getAnnual;
