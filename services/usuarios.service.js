const MongoLib = require("../lib/mongo");
const bcrypt = require("bcrypt");
const { usersCollectionName } = require("../config/config");

class UsersService {
  constructor() {
    this.collection = usersCollectionName;
    this.MongoDB = new MongoLib();
  }

  async register(data) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const user = await this.MongoDB.create(this.collection, data);
    return user;
  }

  async login(email) {
    const user = await this.MongoDB.login(this.collection, email);
    return user;
  }

  async getAll(query) {
    const users = await this.MongoDB.getAll(this.collection, query);
    return users || ["not found"];
  }

  async getOne(userid) {
    const user = await this.MongoDB.get(this.collection, userid);
    return user;
  }

  async update(userid, data) {
    const user = await this.MongoDB.update(this.collection, userid, data);
    return user;
  }

  async delete(userid) {
    const user = await this.MongoDB.delete(this.collection, userid);
    return user;
  }
}

module.exports = UsersService;
