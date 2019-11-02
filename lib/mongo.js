const { MongoClient, ObjectId } = require("mongodb");
const { dbName, dbPassword, dbUser, dbHost } = require("../config/config");

const MONGO_URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/test?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.dbName = dbName;
  }

  //Generales

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query)
        .toArray();
    });
  }

  get(collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {

    return this.connect()
      .then(db => {
        return db.collection(collection).insertOne({ ...data, timestamp: new Date().getTime() });
      })
      .then(result => result.insertedId);
  }

  createMany(collection, arrData) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertMany(arrData);
      })
      .then(result => result.map(entry => entry.insertedId));
  }

  update(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: data },
            { upsert: true }
          );
      })
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .findOneAndDelete({ _id: ObjectId(id) });
      })
      .then(() => id);
  }

  //Especiales

  login(collection, email) {
    return this.connect().then(db =>
      db.collection(collection).findOne({ email: email })
    );
  }

  getManyComments(collection, id) {
    console.log(id);
    return this.connect().then(db =>
      db
        .collection(collection)
        .find({ postid: id })
        .toArray()
    );
  }

  getManyPosts(collection, id) {
    console.log(id);
    return this.connect().then(db =>
      db
        .collection(collection)
        .find({ uid: id })
        .toArray()
    );
  }

  pushGeoById(collection, id, data) {
    return this.connect()
      .then(db =>
        db.collection(collection).updateOne(
          id,
          { $push: { deltas: data } }
          // { safe: true, upsert: true }
        )
      )
      .then(result => result.insertedId);
  }
}

module.exports = MongoLib;
