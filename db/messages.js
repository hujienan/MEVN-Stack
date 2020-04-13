const Joi = require('@hapi/joi')
const db = require('./connection')
const monk = require('monk')

const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    message: Joi.string().max(500).required(),
    imageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    })
})

const messages = db.get('messages')

function getAll() {
    return messages.find()
}

function create(message) {
    if (!message.username) {
        message.username = 'Anonymous'
    }
    const result = schema.validate(message)

    if (result.error == null) {
        message.created = new Date()
        return messages.insert(message)
    } else {
        return Promise.reject(result.error)
    }
}

function remove(id) {
    if (id.length <= 0 ) {
        return Promise.reject({error : "Record not found!"})
    }
    return messages.remove({ _id: monk.id(id) })
}
module.exports = {
    create,
    remove,
    getAll
}