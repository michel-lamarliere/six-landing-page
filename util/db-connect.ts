const { MongoClient } = require('mongodb');

const client = new MongoClient(
	`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PWD}@six-cluster.vl7dd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);

let dbConnection: {};

module.exports = {
	connectToServer: (callback: (error: Error | void) => void) => {
		console.log(client);
		client.connect((error: Error, db: { db: (arg0: string) => {} }) => {
			if (error || !db) {
				console.log('here');

				return callback(error);
			}

			dbConnection = db.db(`${process.env.DB_NAME}`);
			console.log(`Connected to the ${process.env.DB_NAME} database!`);
			return callback();
		});
	},
	getDb: () => {
		return dbConnection;
	},
};
