
const { MongoClient } = require('mongodb');
const fs = require('fs');

class RemoteStore {
    constructor(uri, dbName) {
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = dbName;
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection('sessions');
    }

    async sessionExists({ session }) {
        const count = await this.collection.countDocuments({ session });
        return count > 0;
    }

    async save({ session }) {
        const data = await fs.promises.readFile(`${session}.zip`);
        await this.collection.updateOne(
            { session },
            { $set: { data } },
            { upsert: true }
        );
    }

    async extract({ session, path }) {
        const doc = await this.collection.findOne({ session });
        if (doc) {
            await fs.promises.writeFile(path, doc.data.buffer);
        }
    }

    async delete({ session }) {
        await this.collection.deleteOne({ session });
    }
}

module.exports = RemoteStore;