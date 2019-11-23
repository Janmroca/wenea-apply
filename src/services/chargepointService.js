const timeFuncs = require("../helpers/time.js")
const MongoClient = require("mongodb").MongoClient
const uri = "mongodb+srv://janmroca:v6phcrYBDus70dFN@cluster0-el39i.mongodb.net/test?retryWrites=true&w=majority";
let collection = undefined
MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err)
        return
        }
    collection = client.db("test").collection("chargepoints");
})

async function createChargepoint(name, status) {
    const id = await collection.find().count()

    return collection.insertOne({id: id.toString(), name: name, status: status,
        created_at: timeFuncs.getCurrentTime(), deleted_at: undefined })
        .then( () => {
            return id
        })
}

async function deleteChargepoint(id) {
    const deleted_at =  timeFuncs.getCurrentTime()

    return await updateChargepoint(id, { deleted_at: deleted_at })
}

async function updateChargepoint(id, updates) {
    return collection.updateOne({id: id}, {'$set': updates})
        .then( () => {
            return
        })
}

async function findChargepoint(filters) {
    return collection.find(filters).toArray()
        .then( (result) => {
            result.forEach( chargepoint => {
                chargepoint.created_at = new Date(chargepoint.created_at)
                chargepoint.deleted_at = new Date(chargepoint.deleted_at)
            })
            return result
        })
}

module.exports = {
    createChargepoint,
    deleteChargepoint,
    updateChargepoint,
    findChargepoint
}
