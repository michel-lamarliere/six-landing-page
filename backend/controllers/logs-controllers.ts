import { query, RequestHandler } from 'express';
const { MongoClient, ObjectId } = require('mongodb');
const database = require('../util/db-connect');

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
			// console.log(result);
			console.log('Found the user!');
			console.log(result.log.length);
			if (result.log.length === 0) {
				console.log('Empty log;');
				databaseConnect.updateOne(
					filter,
					{
						$set: {
							log: [
								{
									date: reqDate,
									six: {
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
			} else {
				console.log('Log not empty!');
				let foundSameDate = false;
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
							// $set: {
							// 	log: [
							// 		{
							// 			date: reqDate,
							// 			six: {
							// 				[reqTask]: reqLevelOfCompletion,
							// 			},
							// 		},
							// 	],
							// },
							$set: {
								[`log.${result.log.length}`]: {
									date: reqDate,
									six: {
										[reqTask]: reqLevelOfCompletion,
									},
								},
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
	const {
		userEmail: reqUserEmail,
		startDate: reqStartDate,
		endDate: reqEndDate,
	} = await req.body;

	const client = new MongoClient(process.env.SERVER_URI);

	// DB CONNECTION
	await client.connect();
	const database = await client.db('six-dev');
	const testCollection = await database.collection('test');

	const query = {
		email: reqUserEmail,
	};

	let user;
	try {
		user = testCollection.findOne(query);
		if (!user) {
			throw new Error('User not found.');
		}
	} catch (error) {
		next(error);
	}

	// END
	res.json({ message: 'success' });
	await client.close();
};

exports.addData = addData;
exports.getWeekly = getWeekly;
