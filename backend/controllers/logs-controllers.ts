import { query, RequestHandler } from 'express';
const { MongoClient, ObjectId } = require('mongodb');
const { addDays, format } = require('date-fns');
const database = require('../util/db-connect');

const addData: RequestHandler = async (req, res, next) => {
	const {
		_id: reqIdStr,
		email: reqEmail,
		date: reqDate,
		task: reqTask,
		levelOfCompletion: reqLevelOfCompletion,
	} = await req.body;

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
								// ],
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
					res.json(result);
				} else {
					return { message: 'Failed to update the user!' };
				}
			}
		);
	});
};

const getWeekly: RequestHandler = async (req, res, next) => {
	const reqIdStr = req.params.id;
	console.log({ reqIdStr });
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
			const userResultArray = result.log;

			let foundDatesIndex = [];
			let matchingLogArray = [];

			for (let y = 0; y < datesArray.length; y++) {
				for (let i = 0; i < result.log.length; i++) {
					if (datesArray[y] === result.log[i].date) {
						matchingLogArray.push(result.log[i]);
						foundDatesIndex.push(i);
					}
				}
			}
			let resultsArray = [];
			for (let i = 0; i < foundDatesIndex.length; i++) {
				resultsArray.push(matchingLogArray[i]);
			}
			res.json(resultsArray);
		}
	);
};

exports.addData = addData;
exports.getWeekly = getWeekly;
