import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const database = require('../util/db-connect');

const signUp: RequestHandler = async (req, res, next) => {
	const { name: reqName, email: reqEmail, password: reqPassword } = await req.body;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	let inputsAreValid = {
		all: false,
		name: false,
		email: false,
		password: false,
	};

	// VALIDATION
	if (reqName.trim().length >= 2 && reqName.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/))
		inputsAreValid.name = true;
	if (
		reqEmail.match(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	)
		inputsAreValid.email = true;

	if (
		reqPassword.match(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
		)
	)
		inputsAreValid.password = true;

	if (inputsAreValid.name && inputsAreValid.email && inputsAreValid.password) {
		inputsAreValid.all = true;
	}

	if (!inputsAreValid.all) {
		res.json({ error: 'Erreur lors de la création de compte.' });
		return;
	}

	let existingUser = await databaseConnect.findOne({ email: reqEmail });

	if (existingUser) {
		res.json({
			error: 'Adresse email déjà utilisée, veuillez en choisir une autre ou vous connecter.',
		});
	}

	// HASHING PASSWORD
	if (!existingUser) {
		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(reqPassword, 12);
		} catch (error) {}

		const newUser = {
			name: reqName,
			email: reqEmail,
			password: hashedPassword,
			log: [],
		};
		// CREATES NEW USER
		try {
			await databaseConnect.insertOne(newUser);
		} catch (error) {
			throw new Error('Failed to create new user!');
		}

		// GETS THE ID

		let findingNewUser = await databaseConnect.findOne({
			email: reqEmail,
		});

		let token: string;
		if (findingNewUser) {
			// CREATES THE TOKEN
			try {
				token = await jwt.sign(
					{ id: findingNewUser._id, email: reqEmail },
					'je-mange-du-pain-blanc-enola',
					{
						expiresIn: '1h',
					}
				);
				res.json({
					success: 'Compte créé !',
					token: token,
					id: findingNewUser._id,
					email: findingNewUser.email,
					name: findingNewUser.name,
				});
			} catch (error) {
				res.json({ error: 'Erreur, veuillez réessayer plus tard.' });
			}
		}
	}
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email: reqEmail, password: reqPassword } = req.body;
	const databaseConnect = database.getDb('six-dev');

	let user: {
		id: string;
		name: string;
		email: string;
		password: string;
	};

	let matchingPasswords: boolean;
	let token: string;

	databaseConnect
		.collection('test')
		.findOne(
			{ email: reqEmail },
			async (
				error: {},
				result: { _id: string; name: string; email: string; password: string }
			) => {
				if (!result) {
					res.json({
						error: 'Adresse email non trouvée, veuillez créer un compte.',
					});
					return;
				}

				user = {
					id: result._id,
					name: result.name,
					email: result.email,
					password: result.password,
				};

				matchingPasswords = await bcrypt.compare(
					reqPassword,
					user.password,
					async (error: {}, result: {}) => {
						if (result) {
							token = await jwt.sign(
								{ userId: user.id, email: user.email },
								'je-mange-du-pain-blanc-enola',
								{
									expiresIn: '1h',
								}
							);
							res.json({
								token,
								id: user.id,
								name: user.name,
								email: user.email,
							});
						} else {
							res.json({ error: 'Mot de passe incorrect.' });
						}
					}
				);
			}
		);
};

const changeName: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr, email: reqEmail, newName: reqNewName } = req.body;
	let validateNewName = false;

	if (
		reqNewName.trim().length >= 2 &&
		reqNewName.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/)
	) {
		validateNewName = true;
	}

	if (!validateNewName) {
		res.json({ error: 'Nouveau Nom Invalide !' });
		return;
	}

	const databaseConnect = database.getDb('six-dev');

	const reqId = new ObjectId(reqIdStr);

	const filter = { _id: reqId, email: reqEmail };

	databaseConnect.collection('test').findOne(filter, (error: {}, result: {}) => {
		if (result) {
			databaseConnect.collection('test').updateOne(filter, {
				$set: {
					name: reqNewName,
				},
			});
			res.json({ success: 'Nom modifié !' });
		} else {
			res.json({ error: 'Erreur' });
		}
	});
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.changeName = changeName;
