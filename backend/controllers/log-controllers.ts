import { json } from 'body-parser';
import { getHours, getYear, startOfMonth } from 'date-fns';
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
	} = req.body;

	const reqDate = new Date(reqDateStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const reqId = ObjectId(reqIdStr);

	// CHECKS IF THE USER EXISTS
	const filter = {
		_id: reqId,
	};

	const user = await databaseConnect.findOne(filter);

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

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

	// CHECKS IF THE DATE IS A DATE
	if (!reqDate) {
		inputsAreValid.date.format = false;
	}

	inputsAreValid.date.format = true;

	// CHECKS IF DATE IS IN THE FUTURE
	if (isAfter(reqDate, new Date())) {
		res.status(400).json({
			error: "Impossible d'enregistrer des données dont la date est dans le futur.",
		});

		return;
	} else inputsAreValid.date.pastOrPresent = true;

	// VALIDATES IF THE DATE IS IN THE CORRECT FORMAT AND NOT IN THE FUTURE
	if (inputsAreValid.date.format && inputsAreValid.date.pastOrPresent) {
		inputsAreValid.date.valid = true;
	}

	// VALIDATES THE TASK
	const taskNames = ['food', 'sleep', 'sport', 'relaxation', 'work', 'social'];

	if (taskNames.includes(reqTask)) inputsAreValid.task = true;

	// VALIDATES THE LEVEL OF COMPLETION
	const taskLevels = [0, 1, 2];

	if (taskLevels.includes(reqLevelOfCompletion))
		inputsAreValid.levelOfCompletion = true;

	// VALIDATES THE WHOLE DATA
	if (
		inputsAreValid._id &&
		inputsAreValid.date.valid &&
		inputsAreValid.task &&
		inputsAreValid.levelOfCompletion
	) {
		inputsAreValid.all = true;
	}

	if (!inputsAreValid.all) {
		res.status(400).json({
			error: "Erreur lors de l'enregistrement de données, certaines données sont invalides.",
		});
		return;
	}

	let foundSameDate = false;

	// IF THE LOG IS EMPTY
	if (user.log.length === 0) {
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
		// IF THE LOG ISN'T EMPTY, TRIES TO FIND THE CORRECT DATE
	} else if (user.log.length > 0) {
		for (let i = 0; i < user.log.length; i++) {
			if (isSameDay(user.log[i].date, reqDate)) {
				foundSameDate = true;

				for (let task in user.log[i].six) {
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
		// IF THE CORRECT DATE DOESN'T EXIST
		if (!foundSameDate) {
			databaseConnect.updateOne(filter, {
				$set: {
					[`log.${user.log.length}`]: {
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

	const response = databaseConnect.findOne(filter);

	if (!response) {
		res.status(404).json({ fatal: true });
		return;
	}

	console.log('added data');
	res.status(201).json({ success: true });
};

const getDaily: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqDate = new Date(req.params.date);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	let foundDate = false;

	// GETS THE DATA FOR THE REQUESTED DATE AND SENDS IT
	for (let i = 0; i < user.log.length; i++) {
		if (isSameDay(reqDate, user.log[i].date)) {
			console.log('get daily');
			const dateData = user.log[i];
			res.status(200).json(dateData);
			foundDate = true;
		}
	}

	// IF THE REQUESTED DATE DOESN'T EXIST
	if (!foundDate) {
		const emptyData = {
			date: reqDate,
			six: {
				food: 0,
				sleep: 0,
				sport: 0,
				relaxation: 0,
				work: 0,
				social: 0,
			},
		};

		res.status(202).json(emptyData);
		return;
	}
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqStartDate = new Date(req.params.startofweek);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	// GETS THE WHOLE WEEK'S DATES
	const getDates = (startingDate: Date) => {
		let dateArray = [];

		for (let i = 0; i < 7; i++) {
			let date = addDays(startingDate, i);
			dateArray.push(date);
		}

		return dateArray;
	};

	const datesArray = getDates(reqStartDate);

	let resultsArray = [];

	// CHECKS IF THERE'S DATA FOR THE WEEK'S DATES
	for (let i = 0; i < datesArray.length; i++) {
		let foundDate = false;
		for (let y = 0; y < user.log.length; y++) {
			// IF THE DATE MATCHES, IT PUSHES THE DATA
			if (isSameDay(datesArray[i], user.log[y].date)) {
				foundDate = true;
				resultsArray.push(user.log[y]);
			}
		}
		if (!foundDate) {
			// IF THE DATE DOESN'T MATCH, IT PUSHES EMPTY DATA
			resultsArray.push({
				date: datesArray[i],
				six: {
					food: 0,
					sleep: 0,
					sport: 0,
					relaxation: 0,
					work: 0,
					social: 0,
				},
			});
		}
	}

	console.log('get weekly');
	res.status(200).json(resultsArray);
};

const getMonthly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqStartOfMonthDate = new Date(req.params.date);
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const numberOfDaysInMonth: number = getDaysInMonth(reqStartOfMonthDate);

	const responseArray: any[] = [];

	for (let i = 0; i < numberOfDaysInMonth; i++) {
		let loopingDate = addDays(reqStartOfMonthDate, i);
		let sameDate = false;

		for (let y = 0; y < user.log.length; y++) {
			if (isSameDay(loopingDate, user.log[y].date)) {
				sameDate = true;
				responseArray.push({
					date: loopingDate,
					level: user.log[y].six[reqTask],
				});
			}
		}
		if (!sameDate) {
			responseArray.push({
				date: loopingDate,
				level: 0,
			});
		}
	}

	console.log('get monthly');
	res.status(200).json(responseArray);
};

exports.addData = addData;
exports.getDaily = getDaily;
exports.getWeekly = getWeekly;
exports.getMonthly = getMonthly;
