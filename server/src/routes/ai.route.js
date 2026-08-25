let express = require('express')
const tokenfnc = require('../middlewares/token.middleware')
const { mainchatfnc, getalluserchat, getallusermessage, deletehistory } = require('../controllers/ai.controller')
let airouter = express.Router()

airouter.post('/chat', tokenfnc, mainchatfnc)

airouter.get('/userchat', tokenfnc, getalluserchat)

airouter.get('/usermessages/:chatid', tokenfnc, getallusermessage)

airouter.delete('/delete/:chatid', tokenfnc, deletehistory)

module.exports = airouter