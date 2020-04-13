const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { port } = require('./config')
const messages = require('./db/messages')

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({
        message: "MEVN stack"
    })
})

app.get('/messages', (req, res) => {
    messages.getAll().then(messages => {
        res.json(messages)
    })
})

app.post('/messages', (req, res) => {
    console.log(req.body)
    messages.create(req.body).then(message => {
        res.json(message)
    }).catch(err => {
        res.status(500);
        res.json(err)
    })
})

app.delete('/messages/:messageId', (req, res) => {
    console.log(req.params.messageId)
    messages.remove(req.params.messageId).then(message => {
        res.status(200).json(message)
    }).catch(err => {
        res.status(400).json(err)
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})