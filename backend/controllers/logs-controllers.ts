import { AnyNsRecord } from 'dns';
import { query, RequestHandler } from 'express';
const { MongoClient, ObjectId } = require('mongodb');
const {
	addDays,
	addHours,
	startOfMonth,
	endOfMonth,
	isBefore,
	isAfter,
	parseISO,
	getDaysInMonth,
	compareAsc,
} = require('date-fns');
const database = require('../util/db-connect');

const addData: RequestHandler = async (req, res, next) => {
	const {
		_id: reqIdStr,
		email: reqEmail,
		date: reqDate,
		task: reqTask,
		levelOfCompletion: reqLevelOfCompletion,
	} = await req.body;

	console.log(reqDate);

	const dateFormat = new Date(
		+reqDate.slice(0, 4),
		+reqDate.slice(5, 7) === 12 ? 11 : +reqDate.slice(5, 7) - 1,
		+reqDate.slice(8, 10)
	);

	if (isAfter(dateFormat, new Date())) {
		console.log('Erreur, date dans le futur');
		res.json({ message: 'Erreur, date dans le futur' });
		return;
	}

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const reqId = ObjectId(reqIdStr);

	// FINDING THE USER
	const filter = {
		_id: reqId,
		email: reqEmail,
	};

	databaseConnect.findOne(filter, async (error: {}, result: { log: any }) => {
		if (result) {
			let foundSameDate = false;

			if (result.log.length === 0) {
				databaseConnect.updateOne(
					filter,
					{
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
					},
					(error: any, result: any) => {
						if (result) {
						} else {
						}
					}
				);
			} else if (result.log.length > 0) {
				for (let i = 0; i < result.log.length; i++) {
					if (result.log[i].date === reqDate) {
						foundSameDate = true;
						for (let task in result.log[i].six) {
							if (task === reqTask) {
								databaseConnect.updateOne(
									filter,
									{
										$set: {
											[`log.${i}.six.${reqTask}`]:
												reqLevelOfCompletion,
										},
									},
									(error: any, result: any) => {
										if (result) {
										} else {
											console.log(error);
										}
									}
								);
							} else {
								databaseConnect.updateOne(
									filter,
									{
										$set: {
											[`log.${i}.six.${reqTask}`]:
												reqLevelOfCompletion,
										},
									},
									(error: any, result: any) => {
										if (result) {
										} else {
										}
									}
								);
							}
						}
					}
				}
				if (!foundSameDate) {
					databaseConnect.updateOne(
						filter,
						{
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
						},
						(error: any, result: any) => {
							if (result) {
							} else {
								console.log(error);
							}
						}
					);
				}
			}
		} else {
			return;
		}

		databaseConnect.findOne(
			{
				_id: reqId,
				email: reqEmail,
			},
			(error: {}, result: {}) => {
				if (result) {
					console.log('added data');
					res.json(result);
				} else {
					console.log('added data');
					return { message: 'Failed to update the user!' };
				}
			}
		);
	});
};

const getDaily: RequestHandler = async (req, res, next) => {
	const reqIdStr = req.params.id;
	const reqDate = req.params.date;

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	databaseConnect.findOne(
		{
			_id: reqId,
			'log.date': reqDate,
		},
		(error: {}, result: { log: { date: string }[] }) => {
			if (result) {
				console.log('user found!');
				for (let i = 0; i < result.log.length; i++) {
					if (result.log[i].date === reqDate) {
						let foundDailyLog = result.log[i];
						res.json(foundDailyLog);
						return;
					}
				}
				console.log('get daily');
				res.json({ message: 'No matching date found!' });
			} else {
				console.log('get daily');
				res.json({ message: 'date not found' });
			}
		}
	);
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const reqIdStr = req.params.id;
	const reqStartDate = req.params.startofweek;

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const getDates = (startingDate: string) => {
		let dateArray = [];
		for (let i = 0; i < 7; i++) {
			let date = addDays(new Date(startingDate), i).toISOString().slice(0, 10);
			dateArray.push(date);
		}
		return dateArray;
	};

	databaseConnect.findOne(
		{ _id: reqId },
		(error: {}, result: { log: { date: string }[] }) => {
			if (!result) {
				res.json({ message: 'User not found!' });
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

			let resultsArray = [];

			for (let i = 0; i < foundDatesIndex.length; i++) {
				resultsArray.push(matchingLogArray[i]);
			}
			console.log('get weekly');
			res.json(resultsArray);
		}
	);
};

const getMonthly: RequestHandler = async (req, res, next) => {
	const reqIdStr = req.params.id;
	const reqId = ObjectId(reqIdStr);
	const reqDateStr = req.params.date;
	const reqDate = addHours(parseISO(reqDateStr), 1);
	const reqTask = req.params.task;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	databaseConnect.findOne(
		{
			_id: reqId,
		},
		(
			error: {},
			result: {
				log: [
					{
						date: string;
						six: any;
					}
				];
			}
		) => {
			if (result) {
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
				res.json({ datesArray, responseArray });
			}
		}
	);
};

exports.addData = addData;
exports.getDaily = getDaily;
exports.getWeekly = getWeekly;
exports.getMonthly = getMonthly;
