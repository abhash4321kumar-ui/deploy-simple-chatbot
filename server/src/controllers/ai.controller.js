let chatmodel = require('../model/chat.model')
let messagemodel = require('../model/message.model')
let { generatetitle, generatecontent } = require('../services/ai.service')

async function mainchatfnc(req, res, next) {
    try {
        console.log('running mainchatfnc!')

        let { message, chatid, socketid } = req.body
        let finalchatid = chatid
        let chattitle = null

        if (!chatid) {
            chattitle = await generatetitle(message)
            let chat = await chatmodel.create({
                user: req.user._id,
                title: chattitle
            })
            finalchatid = chat._id
        }

        let usermessage = await messagemodel.create({
            chatid: finalchatid,
            userid: req.user._id,
            content: message,
            role: 'user'
        })

        let currenthistroy = await messagemodel.find({
            chatid: finalchatid,
            userid: req.user._id
        }).sort({ createdAt: 1 });

        let io = req.app.get('io')
        let stream = await generatecontent(currenthistroy)

        
        let fullyairesponse = ''
        console.log('generating response')

        for await (const chunk of stream) {
            
           
            let safeChunk = JSON.parse(JSON.stringify(chunk));

            function extractText(obj) {
                if (!obj) return "";
                if (typeof obj === "string") return obj;

                if (obj.kwargs && typeof obj.kwargs.content === "string" && obj.kwargs.content !== "") {
                    return obj.kwargs.content;
                }
                if (obj.content && typeof obj.content === "string" && obj.content !== "") {
                    return obj.content;
                }
                if (obj.output && typeof obj.output === "string" && obj.output !== "") {
                    return obj.output;
                }

                if (obj.model_request && Array.isArray(obj.model_request.messages) && obj.model_request.messages.length > 0) {
                    let msgs = obj.model_request.messages;
                    return extractText(msgs[msgs.length - 1]); // recursion
                }
                if (obj.messages && Array.isArray(obj.messages) && obj.messages.length > 0) {
                    let msgs = obj.messages;
                    return extractText(msgs[msgs.length - 1]); // recursion
                }
                if (obj.agent && Array.isArray(obj.agent.messages) && obj.agent.messages.length > 0) {
                    let msgs = obj.agent.messages;
                    return extractText(msgs[msgs.length - 1]); // recursion
                }

                return "";
            }

            let textChunk = extractText(safeChunk);

            if (textChunk) {
               
                if(fullyairesponse.includes(textChunk)){
                } else {
                    fullyairesponse += textChunk;
                }

                if (socketid && io) {
                    io.to(socketid).emit('ai_chunk', { chunk: textChunk });
                }
            }
        }

        if (socketid && io) {
            io.to(socketid).emit('ai_stream_end');
        }

        // Fallback condition
        if (!fullyairesponse || fullyairesponse.trim() === '') {
            console.log("Warning: AI returned empty response. Fallback activated.");
            fullyairesponse = "I'm sorry, I couldn't process that request at the moment.";
        }

        let aimessage = await messagemodel.create({
            chatid: finalchatid,
            userid: req.user._id,
            content: fullyairesponse,
            role: 'ai'
        })

        let finalhistroy = await messagemodel.find({
            userid: req.user._id,
            chatid: finalchatid
        }).sort({ createdAt: 1 });

        res.status(201).json({
            message: 'generating chats',
            finalchatid: finalchatid,
            finalhistroy: finalhistroy
        })

    } catch (error) {
        console.log('Error in mainchatfnc:', error);
        next(error);
    }
}

async function getalluserchat(req, res, next) {
    try {

        let userid = req.user._id

        let allchats = await chatmodel.find({ user: userid })

        if (!allchats) {
            return res.status(401).json({
                message: 'unauthorised access!'
            })
        }

        res.status(200).json({
            message: 'getting user chats',
            allchats: allchats
        })



    } catch (error) {
        next(error)
    }
}

async function getallusermessage(req, res, next) {
    try {

        let { chatid } = req.params
        let userid = req.user._id

        let allmessages = await messagemodel.find({
            userid: userid,
            chatid: chatid
        })

        console.log(allmessages)
        console.log(allmessages.length)

        if (!allmessages || allmessages.length === 0) {
            return res.status(401).json({
                message: 'unathorised access!'
            })
        }

        res.status(200).json({
            message: 'getting all messages!',
            allmessages: allmessages
        })

    } catch (error) {
        next(error)
    }
}

async function deletehistory(req, res, next) {
    try {

        let { chatid } = req.params
        let userid = req.user._id

        let chat = await chatmodel.deleteOne({
            _id: chatid,
            user: userid
        })

        if (chat.deletedCount === 0) {
            return res.status(401).json({
                message: 'unthorised access!'
            })
        }

        let messages = await messagemodel.deleteMany({
            chatid: chatid,
            userid: userid
        })

        console.log(messages)

        res.status(204).json({
            message: 'chat deleted!'
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    mainchatfnc,
    getalluserchat,
    getallusermessage,
    deletehistory
}