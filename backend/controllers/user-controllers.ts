import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const { addMinutes, isBefore } = require('date-fns');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v5: uuidv5 } = require('uuid');

const database = require('../util/db-connect');
const { sendEmailConfirmationEmail } = require('../util/send-email-confirmation-email');

const signUp: RequestHandler = async (req, res, next) => {
	const {
		name: reqName,
		email: reqEmail,
		password: reqPassword,
		passwordConfirmation: reqPasswordConfirmation,
	} = await req.body;

	console.log(req.body);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ email: reqEmail });

	if (user) {
		res.status(400).json({
			error: true,
			message:
				'Adresse email déjà utilisée, veuillez en choisir une autre ou vous connecter.',
		});
		return;
	}

	let inputsAreValid = {
		all: false,
		name: false,
		email: false,
		password: false,
		passwordConfirmation: false,
	};

	// VALIDATION
	if (
		reqName.trim().length >= 2 &&
		reqName.trim().match(/^['’\p{L}\p{M}]*-?['’\p{L}\p{M}]*$/giu)
	) {
		inputsAreValid.name = true;
	}

	if (
		reqEmail.match(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	) {
		inputsAreValid.email = true;
	}

	if (
		reqPassword.match(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
		)
	) {
		inputsAreValid.password = true;
	}
	console.log(reqPassword);
	console.log(reqPasswordConfirmation);

	if (reqPassword === reqPasswordConfirmation) {
		inputsAreValid.passwordConfirmation = true;
	}

	if (
		inputsAreValid.name &&
		inputsAreValid.email &&
		inputsAreValid.password &&
		inputsAreValid.passwordConfirmation
	) {
		inputsAreValid.all = true;
	}

	if (!inputsAreValid.all) {
		res.status(400).json({
			error: true,
			message: 'Erreur lors de la création de compte.',
		});
		return;
	}

	// HASHES THE PASSWORD
	const hashedPassword = await bcrypt.hash(reqPassword, 10);
	const hashedConfirmationCode = uuidv5(reqEmail, process.env.UUID_NAMESPACE);

	// CREATES THE USER'S OBJECT
	const newUser = {
		icon: 0,
		name: reqName,
		email: reqEmail,
		password: hashedPassword,
		forgotPassword: {
			code: null,
			nextEmail: null,
		},
		confirmation: {
			confirmed: false,
			code: hashedConfirmationCode,
			nextEmail: addMinutes(new Date(), 5),
		},
		deleteCode: null,
		log: [],
	};

	// INSERTS THE NEW USER IS THE DATABASE
	await databaseConnect.insertOne(newUser);

	// GETS THE ID
	let findingNewUser = await databaseConnect.findOne({ email: reqEmail });

	if (!findingNewUser) {
		res.status(404).json({
			error: true,
			message: 'Erreur, veuillez réessayer plus tard.',
		});
		return;
	}

	// CREATES THE TOKEN
	let token = await jwt.sign(
		{ id: findingNewUser._id, email: findingNewUser.email },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);

	// SEND AN EMAIL CONFIRMATION EMAIL
	sendEmailConfirmationEmail({ to: reqEmail, uniqueCode: hashedConfirmationCode });

	res.status(201).json({
		success: true,
		message: 'Compte créé.',
		token: token,
		id: findingNewUser._id,
		icon: findingNewUser.icon,
		name: findingNewUser.name,
		email: findingNewUser.email,
		confirmedEmail: findingNewUser.confirmation.confirmed,
	});
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email: reqEmail, password: reqPassword } = req.body;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.status(404).json({
			error: true,
			message: 'Adresse email non trouvée, veuillez créer un compte.',
		});
		return;
	}

	// CHECKS IF THE PASSWORD MATCHES THE USER'S HASHED PASSWORD
	const matchingPasswords = await bcrypt.compare(reqPassword, user.password);

	// IF THE PASSWORDS DON'T MATCH
	if (!matchingPasswords) {
		res.status(400).json({ error: true, message: 'Mot de passe incorrect.' });
		return;
	}

	// CREATES A TOKEN
	const token = await jwt.sign(
		{ userId: user._id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);

	res.status(200).json({
		token,
		id: user._id,
		icon: user.icon,
		name: user.name,
		email: user.email,
		confirmedEmail: user.confirmation.confirmed,
	});
};

const confirmEmailAddress: RequestHandler = async (req, res, next) => {
	const email = req.body.email;
	const code = req.body.code;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS AND IF THE CODE MATCHES THE DB'S CODE
	const user = await databaseConnect.findOne({
		email: email,
		'confirmation.code': code,
	});

	// IF IT DOESN'T MATCH
	if (!user) {
		res.status(400).json({ error: true, message: 'Code invalide' });
		return;
	}

	// CONFIRMS THE ACCOUNT
	await databaseConnect.updateOne(
		{ email: email },
		{
			$set: {
				'confirmation.confirmed': true,
			},
		}
	);

	res.status(200).json({ success: true, message: 'Compte confirmé.' });
};

const resendEmailConfirmation: RequestHandler = async (req, res, next) => {
	const id = new ObjectId(req.body.id);
	console.log('HEY');

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: id });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	// IF THE ACCOUNT IS ALREADY CONFIRMED
	if (user.confirmation.confirmed) {
		res.status(400).json({
			error: true,
			message: 'Compte déjà confirmé, veuillez rafraichir vos données.',
		});
		return;
	}

	// CHECKS IF THE USER SENT AN EMAIL DURING THE LAST 5 MINUTES
	if (user.confirmation.nextEmail) {
		const fiveMinutesBetweenSends = !isBefore(
			user.confirmation.nextEmail,
			new Date()
		);

		// IF HE DID
		if (fiveMinutesBetweenSends) {
			res.status(405).json({
				error: true,
				message:
					"Veuillez attendre 5 minutes entre chaque demande d'envoi de mail de confirmation.",
			});
			return;
		}
	}

	const emailWasSent = sendEmailConfirmationEmail({
		to: user.email,
		uniqueCode: user.confirmation.code,
	});

	if (!emailWasSent) {
		return res.status(500).json({
			error: true,
			message: "Une erreur est survenue lors de l'envoi du mail.",
		});
	}

	// ADDS THE NEW TIME INTERVAL IN THE DB
	const nextEmail = addMinutes(new Date(), 5);

	await databaseConnect.updateOne(
		{ _id: id },
		{
			$set: {
				'confirmation.nextEmail': nextEmail,
			},
		}
	);

	res.status(200).json({
		success: true,
		message:
			'Email envoyé. Veuillez vérifier votre boîte de réception ou votre dossier spam.',
	});
};

const refreshData: RequestHandler = async (req, res, next) => {
	const id = new ObjectId(req.params.userId);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: id });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	res.status(200).json({ success: true, message: 'Données rafraichies.', user });
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.confirmEmailAddress = confirmEmailAddress;
exports.refreshData = refreshData;
exports.resendEmailConfirmation = resendEmailConfirmation;
