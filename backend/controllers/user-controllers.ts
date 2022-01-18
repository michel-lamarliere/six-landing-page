import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
		return;
	}

	// HASHING PASSWORD
	let hashedPassword = await bcrypt.hash(reqPassword, 10);

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

	// CREATES THE TOKEN
	if (findingNewUser) {
		try {
			let token = await jwt.sign(
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
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email: reqEmail, password: reqPassword } = req.body;
	console.log('---SIGN-IN');
	console.log({ reqEmail, reqPassword });

	const databaseConnect = await database.getDb('six-dev');

	const result = await databaseConnect.collection('test').findOne({ email: reqEmail });

	if (!result) {
		res.json({
			error: 'Adresse email non trouvée, veuillez créer un compte.',
		});
		return;
	}

	console.log(result.password);

	const matchingPasswords = await bcrypt.compare(reqPassword, result.password);

	console.log({ matchingPasswords });

	if (!matchingPasswords) {
		res.json({ error: 'Mot de passe incorrect.' });
		return;
	}

	const token = await jwt.sign(
		{ userId: result._id, email: result.email },
		'je-mange-du-pain-blanc-enola',
		{
			expiresIn: '1h',
		}
	);

	res.json({
		token,
		id: result._id,
		name: result.name,
		email: result.email,
	});
	console.log('SIGN-IN---');
};

const changeName: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr, newName: reqNewName } = req.body;
	const reqId = new ObjectId(reqIdStr);

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

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const filter = { _id: reqId };

	const result = await databaseConnect.findOne(filter);

	if (!result) {
		res.json({ error: 'Erreur' });
		return;
	}

	await databaseConnect.updateOne(filter, {
		$set: {
			name: reqNewName,
		},
	});

	res.json({ success: 'Nom modifié !', name: reqNewName });
};

const comparePasswords: RequestHandler = async (req, res, next) => {
	console.log('---COMPARE_PASSWORDS');
	const reqId = new ObjectId(req.params.id);
	const reqPassword = req.params.password;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const result = await databaseConnect.findOne({ _id: reqId });

	if (!result) {
		res.json({ error: 'Un problème est survenu.' });
		console.log('error');
		return;
	}

	const matchingPasswords = await bcrypt.compare(
		reqPassword,
		result.password.toString()
	);
	console.log({ matchingPasswords });

	if (!matchingPasswords) {
		res.json({ error: 'Mots de passe non identiques' });
		return;
	}

	res.json({ success: 'Mots de passe identiques' });

	console.log('COMPARE_PASSWORDS---');
};

const changePassword: RequestHandler = async (req, res, next) => {
	console.log('---CHANGE_PASSWORDS');
	const { id: reqIdStr, newPassword: reqNewPassword } = req.body;
	console.log({ reqIdStr, reqNewPassword });

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const filter = { _id: reqId };

	const result = await databaseConnect.findOne(filter);

	if (!result) {
		res.json({ error: 'Une erreur est survenue.' });
		return;
	}

	const newPasswordIsValid = reqNewPassword.match(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	);

	if (!newPasswordIsValid) {
		res.json({ error: 'Nouveau Mot de Passe Invalide.' });
		return;
	}

	const hashedNewPassword = await bcrypt.hash(reqNewPassword, 10);
	console.log(hashedNewPassword);

	await databaseConnect.updateOne(filter, {
		$set: {
			password: hashedNewPassword,
		},
	});

	res.json({ success: 'Mot de passe modifié.' });

	console.log('CHANGE_PASSWORDS---');
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.changeName = changeName;
exports.comparePasswords = comparePasswords;
exports.changePassword = changePassword;
