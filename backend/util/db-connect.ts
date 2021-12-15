const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.SERVER_URI);

let dbConnection: {};

module.exports = {
	connectToServer: (callback: (error: Error | void) => void) => {
		client.connect((error: any, db: any) => {
			if (error || !db) {
				return callback(error);
			}
			dbConnection = db.db('six-dev');
			console.log('Connected to the six-dev database!');
			return callback();
		});
	},
	getDb: () => {
		return dbConnection;
	},
};
