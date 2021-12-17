import { query, RequestHandler } from 'express';
const { MongoClient, ObjectId } = require('mongodb');
const { addDays, format } = require('date-fns');
const database = require('../util/db-connect');

// const addData: RequestHandler = async (req, res, next) => {
// 	const {
// 		_id: reqIdStr,
// 		userEmail: reqUserEmail,
// 		date: reqDate,
// 		task: reqTask,
// 		levelOfCompletion: reqLevelOfCompletion,
// 	} = await req.body;

// 	const databaseConnect = await database.getDb('six-dev').collection('test');

// 	const reqId = ObjectId(reqIdStr);

// 	// FINDING THE USER
// 	const filter = {
// 		_id: reqId,
// 		email: reqUserEmail,
// 	};

// 	databaseConnect.findOne(filter, async (error: {}, result: { log: any }) => {
// 		if (result) {
// 			// console.log(result);
// 			console.log('Found the user!');
// 			console.log(result.log.length);
// 			if (result.log.length === 0) {
// 				console.log('Empty log;');
// 				databaseConnect.updateOne(
// 					filter,
// 					{
// 						$set: {
// 							log: [
// 								{
// 									date: reqDate,
// 									six: {
// 										[reqTask]: reqLevelOfCompletion,
// 									},
// 								},
// 							],
// 						},
// 					},
// 					(error: any, result: any) => {
// 						if (result) {
// 							// console.log(result);
// 							// console.log('Done pushing array in empty log!');
// 						} else {
// 							console.log(error);
// 						}
// 					}
// 				);
// 			} else {
// 				console.log('Log not empty!');
// 				let foundSameDate = false;
// 				for (let i = 0; i < result.log.length; i++) {
// 					if (result.log[i].date === reqDate) {
// 						foundSameDate = true;
// 						console.log(result.log[i].date + ' ' + reqDate);
// 						console.log('Date found!');
// 						for (let task in result.log[i].six) {
// 							console.log(task);
// 							if (task === reqTask) {
// 								console.log('Same task found!');
// 								databaseConnect.updateOne(
// 									filter,
// 									{
// 										$set: {
// 											[`log.${i}.six.${reqTask}`]:
// 												reqLevelOfCompletion,
// 										},
// 									},
// 									(error: any, result: any) => {
// 										if (result) {
// 											// console.log(
// 											// 	'Done push array in already existing log and date!'
// 											// );
// 										} else {
// 											console.log(error);
// 										}
// 									}
// 								);
// 							} else {
// 								console.log('Same task not found, creating a new!');
// 								databaseConnect.updateOne(
// 									filter,
// 									{
// 										$set: {
// 											[`log.${i}.six.${reqTask}`]:
// 												reqLevelOfCompletion,
// 										},
// 									},
// 									(error: any, result: any) => {
// 										if (result) {
// 											// console.log(
// 											// 	'Done push array in alreay existing log and date!'
// 											// );
// 										} else {
// 											console.log(error);
// 										}
// 									}
// 								);
// 							}
// 						}
// 					}
// 				}
// 				if (!foundSameDate) {
// 					console.log('Date not found');
// 					console.log(result.log.length);
// 					databaseConnect.updateOne(
// 						filter,
// 						{
// 							// $set: {
// 							// 	log: [
// 							// 		{
// 							// 			date: reqDate,
// 							// 			six: {
// 							// 				[reqTask]: reqLevelOfCompletion,
// 							// 			},
// 							// 		},
// 							// 	],
// 							// },
// 							$set: {
// 								[`log.${result.log.length}`]: {
// 									date: reqDate,
// 									six: {
// 										[reqTask]: reqLevelOfCompletion,
// 									},
// 								},
// 							},
// 						},
// 						(error: any, result: any) => {
// 							if (result) {
// 								// console.log(
// 								// 	'Done push array in alreay existing log but inexistant date!'
// 								// );
// 							} else {
// 								console.log(error);
// 							}
// 						}
// 					);
// 				}
// 			}
// 		} else {
// 			console.log('User not found!');
// 			return;
// 		}

// 		databaseConnect.findOne(
// 			{
// 				_id: reqId,
// 				email: reqUserEmail,
// 			},
// 			(error: {}, result: {}) => {
// 				if (result) {
// 					console.error('Updated user!');
// 					res.json(result);
// 				} else {
// 					return { message: 'Failed to update the user!' };
// 				}
// 			}
// 		);
// 	});
// };

const addData: RequestHandler = async (req, res, next) => {
	const {
		_id: reqIdStr,
		userEmail: reqUserEmail,
		date: reqDate,
		task: reqTask,
		levelOfCompletion: reqLevelOfCompletion,
	} = await req.body;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const reqId = ObjectId(reqIdStr);

	// FINDING THE USER
	const filter = {
		_id: reqId,
		email: reqUserEmail,
	};

	databaseConnect.findOne(filter, async (error: {}, result: { log: any }) => {
		if (result) {
			let foundSameDate = false;

			if (result.log.length === 0) {
				// console.log(result);
				console.log('Found the user!');
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
							// console.log(result);
							// console.log('Done pushing array in empty log!');
						} else {
							console.log(error);
						}
					}
				);
			} else if (result.log.length > 0) {
				console.log('Log not empty!');
				for (let i = 0; i < result.log.length; i++) {
					if (result.log[i].date === reqDate) {
						foundSameDate = true;
						console.log(result.log[i].date + ' ' + reqDate);
						console.log('Date found!');
						for (let task in result.log[i].six) {
							console.log(task);
							if (task === reqTask) {
								console.log('Same task found!');
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
											// console.log(
											// 	'Done push array in already existing log and date!'
											// );
										} else {
											console.log(error);
										}
									}
								);
							} else {
								console.log('Same task not found, creating a new!');
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
											// console.log(
											// 	'Done push array in alreay existing log and date!'
											// );
										} else {
											console.log(error);
										}
									}
								);
							}
						}
					}
				}
				if (!foundSameDate) {
					console.log('Date not found');
					console.log(result.log.length);
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
								// console.log(
								// 	'Done push array in alreay existing log but inexistant date!'
								// );
							} else {
								console.log(error);
							}
						}
					);
				}
			}
		} else {
			console.log('User not found!');
			return;
		}

		databaseConnect.findOne(
			{
				_id: reqId,
				email: reqUserEmail,
			},
			(error: {}, result: {}) => {
				if (result) {
					console.error('Updated user!');
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
				console.log('User not found!');
				res.json({ message: 'User not found!' });
				return;
			}
			const datesArray = getDates(reqStartDate);
			console.log({ datesArray });
			console.log('User found!');
			const userResultArray = result.log;
			console.log({ userResultArray });

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

			console.log({ matchingLogArray });

			let resultsArray = [];
			for (let i = 0; i < foundDatesIndex.length; i++) {
				resultsArray.push(matchingLogArray[i]);
			}
			console.log({ resultsArray });
			res.json(resultsArray);
		}
	);
};

exports.addData = addData;
exports.getWeekly = getWeekly;
