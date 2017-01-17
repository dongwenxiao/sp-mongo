const mongo = require('mongodb')
const ObjectID = mongo.ObjectID
const MongoClient = mongo.MongoClient


export default class spMongoDB {
    constructor(opt) {
        this.ip = opt.ip
        this.port = opt.port
        this.db = opt.db
    }

    
    /**
     * 获取mongodb链接对象
     * 
     * @returns mongodb 链接对象（Promise）
     * 
     * @memberOf spMongoDB
     */
    getDB() {
        return MongoClient.connect(`mongodb://${this.ip}:${this.port}/${this.db}`)
    }

    /**
     * 查询数据
     * 
     * @param {any} collection 集合名字
     * @param {any} [selecter={}] 查询条件
     * @returns
     * 
     * @memberOf MongoDB
     */
    async find(collection, selecter = {}) {

        if (selecter._query === undefined)
            selecter._query = {}

        if (selecter._query._id)
            selecter._query._id = new ObjectID(selecter._query._id)

        const db = await this.getDB()
        const col = await db.collection(collection)

        let cursor = col.find(selecter._query)

        selecter._limit !== undefined && cursor.limit(selecter._limit)
        selecter._skip !== undefined && cursor.skip(selecter._skip)
        selecter._filter !== undefined && cursor.skip(selecter._filter) // 子项过滤

        const result = cursor.toArray()
        db.close()

        return result

    }

    async count(collection, selecter = {}) {

    }

    async insert(collection, doc) {
        const db = await this.getDB()
        const col = await db.collection(collection)

        const result = await col.insert(doc)

        db.close()
        return result
    }

    async update(collection, selecter, doc, option = { multi: true, upsert: true }) {

        if (selecter === undefined) return false
        if (JSON.stringify(selecter) == '{}') return false

        if (selecter._id)
            selecter._id = new ObjectID(selecter._id)

        const db = await this.getDB()
        const col = await db.collection(collection)

        const result = col.update(selecter, { $set: doc }, option)

        db.close()
        return result
    }

    async delete(collection, selecter) {

        if (selecter === undefined) return false

        if (selecter._id)
            selecter._id = new ObjectID(selecter._id)

        const db = await this.getDB()
        const col = await db.collection(collection)

        const result = col.remove(selecter)

        db.close()
        return result
    }

}