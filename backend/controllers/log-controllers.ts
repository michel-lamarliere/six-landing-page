import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const { addDays, addHours, isAfter, parseISO, getDaysInMonth } = require('date-fns');
const database = require('../util/db-connect');

const addData: RequestHandler = async (req, res, next) => {
	const {
		_id: reqIdStr,
		date: reqDate,
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

	if (reqDate.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/))
		inputsAreValid.date.format = true;

	const dateFormat = new Date(
		+reqDate.slice(0, 4),
		+reqDate.slice(5, 7) === 12 ? 11 : +reqDate.slice(5, 7) - 1,
		+reqDate.slice(8, 10)
	);

	if (isAfter(dateFormat, new Date())) {
		res.json({
			error: "Impossible d'enregistrer des données dont la date est dans le futur",
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
		res.json({ error: "Erreur lors de l'enregistrement de données" });
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
			if (result.log[i].date === reqDate) {
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
		console.log('added data');
		return { error: 'Failed to update the user!' };
	}

	console.log('added data');
	res.json(result);
};

const getDaily: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqDate = req.params.date;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const result = await databaseConnect.findOne({
		_id: reqId,
		'log.date': reqDate,
	});

	if (!result) {
		res.json({ message: "Date non trouvée, création de l'object." });
		return;
	}

	for (let i = 0; i < result.log.length; i++) {
		if (result.log[i].date === reqDate) {
			let foundDailyLog = result.log[i];
			console.log('get daily');
			res.json(foundDailyLog);
		}
	}
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqStartDate = req.params.startofweek;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const getDates = (startingDate: string) => {
		let dateArray = [];

		for (let i = 0; i < 7; i++) {
			let date = addDays(new Date(startingDate), i).toISOString().slice(0, 10);
			dateArray.push(date);
		}

		return dateArray;
	};

	const result = await databaseConnect.findOne({ _id: reqId });

	if (!result) {
		res.json({ error: 'User not found!' });
		return;
	}

	const datesArray = getDates(reqStartDate);

	let foundDatesIndex = [];
	let matchingLogArray = [];

	for (let i = 0; i < datesArray.length; i++) {
		for (let y = 0; y < result.log.length; y++) {
			if (datesArray[i] === result.log[y].date) {
				foundDatesIndex.push(y);
				matchingLogArray.push(result.log[y]);
			}
		}
	}

	const resultsArray = [];

	for (let i = 0; i < foundDatesIndex.length; i++) {
		resultsArray.push(matchingLogArray[i]);
	}

	console.log('get weekly');
	res.json(resultsArray);
};

const getMonthly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqDateStr = req.params.date;
	const reqDate = addHours(parseISO(reqDateStr), 1);
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const result = await databaseConnect.findOne({
		_id: reqId,
	});

	if (!result) {
		return;
	}

	const numberOfDays: number = getDaysInMonth(reqDate);
	const datesArray = [];

	for (let i = 1; i < numberOfDays + 1; i++) {
		let testDate =
			i < 10
				? reqDate.toISOString().slice(0, 7) + '-0' + i.toString()
				: reqDate.toISOString().slice(0, 7) + '-' + i.toString();
		datesArray.push(testDate);
	}

	const responseArray: any[] = [];

	for (let i = 0; i < datesArray.length; i++) {
		let matched = false;
		let y = 0;

		for (let y = 0; y < datesArray.length; y++) {
			if (result.log[y] && datesArray[i] === result.log[y].date) {
				responseArray.push(result.log[y].six[reqTask]);
				matched = true;
			}
		}

		if (y > result.log.length) {
			matched = false;
		}

		if (!matched) {
			responseArray.push(0);
		}
	}
	console.log('get monthly');
	res.json({ datesArray, responseArray });
};

exports.addData = addData;
exports.getDaily = getDaily;
exports.getWeekly = getWeekly;
exports.getMonthly = getMonthly;
