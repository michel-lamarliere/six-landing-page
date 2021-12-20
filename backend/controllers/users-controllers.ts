import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('../util/db-connect');

const signUp: RequestHandler = async (req, res, next) => {
	const { name: reqName, email: reqEmail, password: reqPassword } = await req.body;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	databaseConnect.findOne({ email: reqEmail }, (error: {}, result: {}) => {
		if (error) {
		}
		if (result) {
			res.json({
				message:
					'Adresse email déjà utilisée, veuillez en choisir une autre ou vous connecter.',
			});
		}
	});

	// HASHING PASSWORD
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
		databaseConnect.insertOne(newUser);
	} catch (error) {
		throw new Error('Failed to create new user!');
	}

	// GETS THE ID
	let token: string;
	databaseConnect.findOne(
		{ email: reqEmail },
		async (error: any, result: { _id: {} }) => {
			if (result) {
				// CREATES THE TOKEN
				try {
					token = await jwt.sign(
						{ id: result._id, email: reqEmail },
						'je-mange-du-pain-blanc-enola',
						{
							expiresIn: '1h',
						}
					);
				} catch (error) {}
			}
			res.json({ message: 'Compte créé, veuillez-vous connecter.' });
		}
	);
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
							res.json({ message: 'Mot de passe incorrect.' });
						}
					}
				);
			}
		);
};

exports.signUp = signUp;
exports.signIn = signIn;
