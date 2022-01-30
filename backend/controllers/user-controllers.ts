import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const database = require('../util/db-connect');
const { v5: uuidv5 } = require('uuid');
var crypto = require('crypto');

const { createNodemailerTransporter } = require('../util/nodemailer-transporter');
const { emailConfirmationEmail } = require('../util/email-confirmation');

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
		res.status(400).json({ error: 'Erreur lors de la création de compte.' });
		return;
	}

	let existingUser = await databaseConnect.findOne({ email: reqEmail });

	if (existingUser) {
		res.status(400).json({
			error: 'Adresse email déjà utilisée, veuillez en choisir une autre ou vous connecter.',
		});
		return;
	}

	// HASHING PASSWORD
	const hashedPassword = await bcrypt.hash(reqPassword, 10);
	const hashedConfirmationCode = uuidv5(reqEmail, process.env.UUID_NAMESPACE);
	console.log(hashedConfirmationCode);

	const newUser = {
		name: reqName,
		email: reqEmail,
		password: hashedPassword,
		forgotPasswordCode: null,
		confirmation: {
			confirmed: false,
			code: hashedConfirmationCode,
		},
		log: [],
	};

	// CREATES NEW USER
	await databaseConnect.insertOne(newUser);

	// GETS THE ID
	let findingNewUser = await databaseConnect.findOne({ email: reqEmail });

	if (!findingNewUser) {
		res.status(404).json({ error: 'Erreur, veuillez réessayer plus tard.' });
		return;
	}

	// CREATES THE TOKEN
	let token = await jwt.sign(
		{ id: findingNewUser._id, email: findingNewUser.email },
		'je_mange_du_pain_blanc_enola',
		{ expiresIn: '1h' }
	);

	// EMAIL
	emailConfirmationEmail(reqEmail, hashedConfirmationCode);

	res.status(201).json({
		success: 'Compte créé !',
		token: token,
		id: findingNewUser._id,
		name: findingNewUser.name,
		email: findingNewUser.email,
		confirmedEmail: findingNewUser.confirmation.confirmed,
	});
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email: reqEmail, password: reqPassword } = req.body;
	console.log('---SIGN-IN');
	console.log({ reqEmail, reqPassword });

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const result = await databaseConnect.findOne({ email: reqEmail });

	if (!result) {
		res.status(404).json({
			error: 'Adresse email non trouvée, veuillez créer un compte.',
		});
		return;
	}

	console.log(result.password);

	const matchingPasswords = await bcrypt.compare(reqPassword, result.password);

	console.log({ matchingPasswords });

	if (!matchingPasswords) {
		res.status(400).json({ error: 'Mot de passe incorrect.' });
		return;
	}

	const token = await jwt.sign(
		{ userId: result._id, email: result.email },
		'je_mange_du_pain_blanc_enola',
		{ expiresIn: '1h' }
	);

	res.status(200).json({
		token,
		id: result._id,
		name: result.name,
		email: result.email,
		confirmedEmail: result.confirmation.confirmed,
	});
	console.log('SIGN-IN---');
};

const confirmEmailAddress: RequestHandler = async (req, res, next) => {
	const email = req.body.email;
	const code = req.body.code;

	console.log(email, code);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({
		email: email,
		'confirmation.code': code,
	});

	if (!user) {
		res.status(400).json({ error: 'Code invalide' });
		return;
	}

	await databaseConnect.updateOne(
		{ email: email },
		{
			$set: {
				'confirmation.confirmed': true,
			},
		}
	);

	res.status(200).json({ success: 'Compte confirmé.' });
};

const refreshData: RequestHandler = async (req, res, next) => {
	const id = new ObjectId(req.params.userId);
	console.log(id);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: id });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	res.status(200).json({ success: 'Données rafraichies', user });
};

const resendEmailConfirmation: RequestHandler = async (req, res, next) => {
	const id = new ObjectId(req.body.id);
	console.log(id);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: id });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	if (user.confirmation.confirmed) {
		res.status(400).json({
			error: 'Compte déjà confirmé, veuillez rafraichir vos données.',
		});
		return;
	}

	try {
		await emailConfirmationEmail(user.email, user.confirmation.code);
	} catch (error) {
		res.status(500).json({ error: 'Une erreur est survenue.' });
		console.log('error');
		return;
	}

	res.status(200).json({
		success:
			'Email envoyé ! Veuillez vérifier votre boîte de réception ou votre dossier spam.',
	});
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.confirmEmailAddress = confirmEmailAddress;
exports.refreshData = refreshData;
exports.resendEmailConfirmation = resendEmailConfirmation;
