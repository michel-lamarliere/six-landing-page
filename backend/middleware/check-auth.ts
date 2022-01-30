const jwt = require('jsonwebtoken');
import { RequestHandler } from 'express';

const checkAuth: RequestHandler = (
	// req: { headers: { authorization: string }; userData: { userId: {} } },
	req: any,
	res,
	next
) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	if (!req.headers.authorization) {
		res.status(403).json({ error: 'Pas de req.header.authorization' });
		return;
	}

	try {
		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			console.log("Vous n'êtes pas autorisé à effectuer cette action.");
			res.status(403).json({
				error: "Vous n'êtes pas autorisé à effectuer cette action.",
			});
			return;
		}

		const decodedToken = jwt.verify(token, 'je_mange_du_pain_blanc_enola');
		req.userData = { id: decodedToken.id };
		next();
	} catch (error) {
		console.log("Erreur lors de la vérification d'autorisation.");
		res.status(500).json({ error: "Erreur lors de la vérification d'autorisation." });
		return;
	}
};

module.exports = checkAuth;
