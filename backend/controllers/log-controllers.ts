import { json } from 'body-parser';
import { getHours, startOfMonth } from 'date-fns';
import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const {
	addDays,
	addHours,
	isAfter,
	parseISO,
	getDaysInMonth,
	isSameDay,
} = require('date-fns');
const database = require('../util/db-connect');

const addData: RequestHandler = async (req, res, next) => {
	const {
		_id: reqIdStr,
		date: reqDateStr,
		task: reqTask,
		levelOfCompletion: reqLevelOfCompletion,
	} = await req.body;

	// VALIDATION
	let inputsAreValid = {
		all: false,
		_id: true,
		date: {
			valid: false,
			format: false,
			pastOrPresent: false,
		},
		task: false,
		levelOfCompletion: false,
	};

	if (reqDateStr.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/))
		inputsAreValid.date.format = true;

	const reqDate =
		// addHours(
		// new Date(
		// 	+reqDateStr.slice(0, 4),
		// 	+reqDateStr.slice(5, 7) === 12 ? 11 : +reqDateStr.slice(5, 7) - 1,
		// 	+reqDateStr.slice(8, 10)
		// ),
		new Date(reqDateStr);
	// ,1
	// );

	if (isAfter(reqDate, new Date())) {
		res.status(400).json({
			error: "Impossible d'enregistrer des données dont la date est dans le futur.",
		});

		return;
	} else inputsAreValid.date.pastOrPresent = true;

	if (inputsAreValid.date.format && inputsAreValid.date.pastOrPresent) {
		inputsAreValid.date.valid = true;
	}

	const taskNames = ['food', 'sleep', 'sport', 'relaxation', 'work', 'social'];

	if (taskNames.includes(reqTask)) inputsAreValid.task = true;

	const taskLevels = [0, 1, 2];

	if (taskLevels.includes(reqLevelOfCompletion))
		inputsAreValid.levelOfCompletion = true;

	if (
		inputsAreValid._id &&
		inputsAreValid.date.valid &&
		inputsAreValid.task &&
		inputsAreValid.levelOfCompletion
	) {
		inputsAreValid.all = true;
	}

	if (!inputsAreValid.all) {
		res.status(400).json({ error: "Erreur lors de l'enregistrement de données" });
		return;
	}

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const reqId = ObjectId(reqIdStr);

	// FINDING THE USER
	const filter = {
		_id: reqId,
	};

	const result = await databaseConnect.findOne(filter);

	if (!result) {
		res.status(404).json({ fatal: true });
		return;
	}

	let foundSameDate = false;

	if (result.log.length === 0) {
		databaseConnect.updateOne(filter, {
			$set: {
				log: [
					{
						date: reqDate,
						six: {
							food: 0,
							sleep: 0,
							sport: 0,
							relaxation: 0,
							work: 0,
							social: 0,
							[reqTask]: reqLevelOfCompletion,
						},
					},
				],
			},
		});
	} else if (result.log.length > 0) {
		for (let i = 0; i < result.log.length; i++) {
			if (isSameDay(result.log[i].date, reqDate)) {
				foundSameDate = true;

				for (let task in result.log[i].six) {
					if (task === reqTask) {
						databaseConnect.updateOne(filter, {
							$set: {
								[`log.${i}.six.${reqTask}`]: reqLevelOfCompletion,
							},
						});
					} else {
						databaseConnect.updateOne(filter, {
							$set: {
								[`log.${i}.six.${reqTask}`]: reqLevelOfCompletion,
							},
						});
					}
				}
			}
		}

		if (!foundSameDate) {
			databaseConnect.updateOne(filter, {
				$set: {
					[`log.${result.log.length}`]: {
						date: reqDate,
						six: {
							food: 0,
							sleep: 0,
							sport: 0,
							relaxation: 0,
							work: 0,
							social: 0,
							[reqTask]: reqLevelOfCompletion,
						},
					},
				},
			});
		}
	}

	const user = databaseConnect.findOne(filter);

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	console.log('added data');
	res.status(201).json(result);
};

const getDaily: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqDateStr = req.params.date;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	let reqDate = new Date(reqDateStr);
	let foundDate = false;

	for (let i = 0; i < user.log.length; i++) {
		if (isSameDay(reqDate, user.log[i].date)) {
			console.log('get daily');
			console.log(user.log[i].date);
			const dateData = user.log[i];
			res.status(200).json(dateData);
			foundDate = true;
		}
	}

	if (!foundDate) {
		res.status(202).json({ message: "Date non trouvée, création de l'object." });
		return;
	}
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqStartDateStr = req.params.startofweek;

	// const year = +reqStartDateStr.slice(0, 4);
	// const month = +reqStartDateStr.slice(5, 7) - 1;
	// const day = +reqStartDateStr.slice(8, 10);

	// const reqStartDate = addHours(new Date(year, month, day), 1);

	// const reqStartDate = addHours(new Date(reqStartDateStr), 1);
	const reqStartDate = new Date(reqStartDateStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const getDates = (startingDate: Date) => {
		let dateArray = [];

		for (let i = 0; i < 7; i++) {
			let date = addDays(startingDate, i);
			dateArray.push(date);
		}

		return dateArray;
	};

	const datesArray = getDates(reqStartDate);

	let foundDatesIndex = [];
	let matchingLogArray = [];

	for (let i = 0; i < datesArray.length; i++) {
		for (let y = 0; y < user.log.length; y++) {
			if (isSameDay(datesArray[i], user.log[y].date)) {
				foundDatesIndex.push(y);
				matchingLogArray.push(user.log[y]);
			}
		}
	}

	const resultsArray = [];

	for (let i = 0; i < foundDatesIndex.length; i++) {
		resultsArray.push(matchingLogArray[i]);
	}

	console.log('get weekly');
	res.status(200).json(resultsArray);
};

const getMonthly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqDateStr = req.params.date;
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	// const year = +reqDateStr.slice(0, 4);
	// // JAN is 0, DEC is 11, 12 is JAN of next year
	// const month = +reqDateStr.slice(5, 7) - 1;
	// const day = +reqDateStr.slice(8, 10);

	// const reqDate = addHours(new Date(year, month, day), 1);

	// const reqDate = addHours(new Date(reqDateStr), 1);
	const reqDate = new Date(reqDateStr);

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const numberOfDays: number = getDaysInMonth(reqDate);
	const firstOfMonth = startOfMonth(reqDate);
	const datesArray = [];

	for (let i = 0; i < numberOfDays; i++) {
		const date = addDays(addHours(firstOfMonth, 1), i);
		datesArray.push(date);
	}

	const responseArray: any[] = [];

	for (let i = 0; i < datesArray.length; i++) {
		let matched = false;
		let y = 0;

		for (let y = 0; y < datesArray.length; y++) {
			if (user.log[y] && isSameDay(datesArray[i], user.log[y].date)) {
				responseArray.push(user.log[y].six[reqTask]);
				matched = true;
			}
		}

		if (y > user.log.length) {
			matched = false;
		}

		if (!matched) {
			responseArray.push(0);
		}
	}

	console.log('get monthly');
	res.status(200).json({ datesArray, responseArray });
};

exports.addData = addData;
exports.getDaily = getDaily;
exports.getWeekly = getWeekly;
exports.getMonthly = getMonthly;
