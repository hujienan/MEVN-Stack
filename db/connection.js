const monk = require('monk')
const { mongo_db_uri } = require('../config')
const db = monk(mongo_db_uri)

module.exports = db