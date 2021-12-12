// const jwt = require('jsonwebtoken');
// import { RequestHandler } from 'express';

// const verifyAuth: RequestHandler = (req, res, next) => {
// 	if (req.method === 'OPTIONS') {
// 		return next();
// 	}
// 	try {
// 		const token = req.headers.authorization.split(' ')[1];
// 		if (!token) {
// 			throw new Error('Authentication failed!');
// 		}
// 		const decodedToken = jwt.verify(token, process.env.PRIVATE_TOKEN_STRING);
// 		req.userData = { userId: decodedToken.userId };
// 		next();
// 	} catch (err) {
// 		const error = new Error('Authentication failed!');
// 		return next(error);
// 	}
// };

// module.exports = verifyAuth;
