const { MongoClient } = require('mongodb');

const client = new MongoClient(
	`mongodb+srv://${process.env.SERVER_USER_NAME}:${process.env.SERVER_USER_PWD}@six-cluster.vl7dd.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
);

let dbConnection: {};

module.exports = {
	connectToServer: (callback: (error: Error | void) => void) => {
		client.connect((error: Error, db: { db: (arg0: string) => {} }) => {
			if (error || !db) {
				return callback(error);
			}

			dbConnection = db.db('development');
			console.log(`Connected to the ${process.env.DATABASE_NAME} database!`);
			return callback();
		});
	},
	getDb: () => {
		return dbConnection;
	},
};
