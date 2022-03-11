import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const { addDays, isAfter, getDaysInMonth, isSameDay } = require('date-fns');
const database = require('../util/db-connect');

const addData: RequestHandler = async (req, res, next) => {
	const {
		_id: reqIdStr,
		date: reqDateStr,
		task: reqTask,
		levelOfCompletion: reqLevelOfCompletion,
	} = req.body;

	const reqDate = new Date(reqDateStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	const reqId = ObjectId(reqIdStr);

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

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
		return res.status(400).json({
			error: "Impossible d'enregistrer des données dont la date est dans le futur.",
		});
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
		return res.status(400).json({
			error: "Erreur lors de l'enregistrement de données, certaines données sont invalides.",
		});
	}

	await databaseConnect
		.findOne({ _id: reqId, 'log.date': reqDate })
		.then((result: {}) => {
			if (result) {
				databaseConnect.updateOne(
					{ _id: reqId, 'log.date': reqDate },
					{
						$set: {
							[`log.$.six.${reqTask}`]: reqLevelOfCompletion,
						},
					}
				);
			} else {
				databaseConnect.updateOne(
					{ _id: reqId },
					{
						$push: {
							log: {
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
					}
				);
			}
			console.log('added data');
			res.status(201).json({ success: true });
		})
		.catch((err: {}) => {
			res.status(400).json({
				message: "Erreur lors de l'enregistrement des données.",
			});
		});
};

const getDaily: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqDate = new Date(req.params.date);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	// IF THE REQUESTED DATE DOESN'T EXIST
	await databaseConnect.findOne(
		{ _id: reqId, 'log.date': reqDate },
		(error: {}, result: {}) => {
			if (error) {
				return res.status(400).json({
					message: 'Erreur lors de la récupération de données.',
				});
			}

			if (!result) {
				return res.status(202).json({
					data: {
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
	);

	await databaseConnect
		.aggregate([
			{
				$match: {
					_id: reqId,
					'log.date': reqDate,
				},
			},
			// { $project: { _id: 0, data: { $getField: 'log.$' } } },
			{ $project: { _id: 0, 'log.$.six': 1 } },
			{ filter: 'log.date' },
		])
		.forEach((doc: {}) => {
			console.log(doc);
			return res.status(200).json(doc);
		});
	// .project();
	// .forEach((doc: any) => {
	// 	ouais.push(doc.log);
	// });

	// console.log(essai);
	// console.log(ouais);

	// if (!foundDate) {
	// 	const emptyData = {
	// 		date: reqDate,
	// 		six: {
	// 			food: 0,
	// 			sleep: 0,
	// 			sport: 0,
	// 			relaxation: 0,
	// 			work: 0,
	// 			social: 0,
	// 		},
	// 	};

	// 	res.status(202).json(emptyData);

	// 	// GETS THE DATA FOR THE REQUESTED DATE AND SENDS IT
	// 	for (let i = 0; i < user.log.length; i++) {
	// 		if (isSameDay(reqDate, user.log[i].date)) {
	// 			console.log('get daily');
	// 			const dateData = user.log[i];
	// 			res.status(200).json(dateData);
	// 			foundDate = true;
	// 		}
	// 	}

	// 	return;
	// }
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqStartDate = new Date(req.params.startofweek);

	const databaseConnect = await database.getDb('six-dev').collection('users');

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

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const numberOfDaysInMonth: number = getDaysInMonth(reqStartOfMonthDate);

	const responseArray: {}[] = [];

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
