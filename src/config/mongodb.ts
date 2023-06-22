import { MongoClient } from 'mongodb'
import { environments } from '../constants/environments'

const uri = environments.MONGODB_URI
const dbname = environments.MONDODB_DATABASE

export const db = {
    connection: null,
    connect: (done: any) => {
        if (db.connection) {
            done();
        } else {
            MongoClient.connect(uri, {})
                .then((client: MongoClient) => {
                    db.connection = client.db(dbname)
                    done();
                })
                .catch((err: Error) => {
                    return done(err);
                });
        }
    },
    get: () => {
        return db.connection;
    },
};
