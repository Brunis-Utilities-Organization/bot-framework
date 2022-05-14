import * as sqlite3 from "better-sqlite3"
import { Collection, Db, MongoClient } from "mongodb"

export type dbType = 'SQLITE' | 'MONGODB'

export class EasyDatabase {
    public type: dbType
    private db: Db | sqlite3.Database
    private dbNamespace: string

    constructor(type: dbType, dbName?: string, uri?: string) {
        // TODO: init system
        if (type == 'MONGODB' && !uri) throw new Error("You must pass a MongoDB connection URI in order to use the database in MongoDB mode.")
        if (type == 'MONGODB' && !dbName) throw new Error("You must pass a valid database name when using the database in MongoDB mode.")

        if (type == 'MONGODB') {
            const con = await new MongoClient(uri).connect()
            const db = con.db(databaseNamespace)
            await db.command({ ping: 1 })

            this.db = db.collection(databaseNamespace)
        } else {
            this.db = sqlite3.default(uri || "./unnamed_database.db")
        }
    }
}

export class KeyValueDatabase {
    public type: dbType
    private db: Collection | sqlite3.Database
    private dbNamespace: string

    constructor(type: dbType, databaseNamespace: string, uri?: string) {
        // TODO: init system
        if (type == 'MONGODB' && !uri) throw new Error("You must pass a MongoDB connection URI in order to use the key-value database in MongoDB mode.")
        
        if (type == 'MONGODB') {
            (async () => {
                const con = await new MongoClient(uri).connect()
                const db = con.db(databaseNamespace)
                await db.command({ ping: 1 })

                this.db = db.collection(databaseNamespace)
            })()

        } else {
            this.db = sqlite3.default(uri || "./unnamed_database.db")
        }
    }

    public async exists(key: string): Promise<boolean> {
        return (this.type == 'MONGODB' ? await (this.db as Collection).findOne({ key: key }) : await (this.db as sqlite3.Database).prepare(`SELECT FROM ${this.dbNamespace} WHERE key = ? LIMIT 1`).get()) ? true : false
    }

    public async get(key: string): Promise<any> {
        return this.type == 'MONGODB' ? await (this.db as Collection).findOne({ key: key }) : await (this.db as sqlite3.Database).prepare(`SELECT FROM ${this.dbNamespace} WHERE key = ? LIMIT 1`).get()
    }

    public async set(key: string, object) {
        const jsonized = JSON.stringify(object)
        if (this.type == 'MONGODB') {
            await (this.db as Collection).updateOne({ key: key }, { $set: { key: key, value: jsonized } }, { upsert: true })
        } else {
            (this.db as sqlite3.Database).prepare(`INSERT OR REPLACE INTO ${this.dbNamespace} (key, value) VALUES (?, ?)`).run(key, jsonized)
        }
    }
}