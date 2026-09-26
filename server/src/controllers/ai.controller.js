let chatmodel = require('../model/chat.model');
let messagemodel = require('../model/message.model');
let { generatetitle, generatecontent } = require('../services/ai.service');

async function mainchatfnc(req, res, next) {
    try {
        console.log('running mainchatfnc!');

        let { message, chatid, socketid } = req.body;
        let finalchatid = chatid;
        let chattitle = null;

        // Agar naya chat hai toh Title generate karein
        if (!chatid) {
            chattitle = await generatetitle(message);
            let chat = await chatmodel.create({
                user: req.user._id,
                title: chattitle
            });
            finalchatid = chat._id;
        }

        // User ka message save karein
        await messagemodel.create({
            chatid: finalchatid,
            userid: req.user._id,
            content: message,
            role: 'user'
        });

        // Current history DB se nikalein
        let currenthistroy = await messagemodel.find({
            chatid: finalchatid,
            userid: req.user._id
        }).sort({ createdAt: 1 });

        let io = req.app.get('io');
        let eventStream = await generatecontent(currenthistroy);

        let fullyairesponse = '';
        console.log('generating response...');

        // Stream Process karna
        for await (const chunk of eventStream) {
            if (chunk.messages && chunk.messages.length > 0) {
                const lastMessage = chunk.messages[chunk.messages.length - 1];
                
                // Sirf AI ka response handle karna hai (Tools/Human nahi)
                if (lastMessage._getType() === "ai" && lastMessage.content) {
                    let textChunk = lastMessage.content;
                    
                    // Naya text calculate karna (jo ab tak send nahi hua)
                    let newChunkText = textChunk.slice(fullyairesponse.length);
                    
                    if (newChunkText) {
                        fullyairesponse = textChunk; 
                        
                        if (socketid && io) {
                            io.to(socketid).emit('ai_chunk', { chunk: newChunkText });
                        }
                    }
                }
            }
        }

        if (socketid && io) {
            io.to(socketid).emit('ai_stream_end');
        }

        // Agar response kisi wajah se khali aaye
        if (!fullyairesponse || fullyairesponse.trim() === '') {
            console.log("Warning: AI returned empty response. Fallback activated.");
            fullyairesponse = "I'm sorry, I couldn't process that request at the moment.";
        }

        // AI ka pura generated message DB mein save karein
        await messagemodel.create({
            chatid: finalchatid,
            userid: req.user._id,
            content: fullyairesponse,
            role: 'ai'
        });

        let finalhistroy = await messagemodel.find({
            userid: req.user._id,
            chatid: finalchatid
        }).sort({ createdAt: 1 });

        res.status(201).json({
            message: 'generating chats',
            finalchatid: finalchatid,
            finalhistroy: finalhistroy
        });

    } catch (error) {
        console.log('Error in mainchatfnc:', error);
        next(error);
    }
}

async function getalluserchat(req, res, next) {
    try {
        let userid = req.user._id;
        let allchats = await chatmodel.find({ user: userid });

        if (!allchats) {
            return res.status(401).json({ message: 'unauthorised access!' });
        }

        res.status(200).json({ message: 'getting user chats', allchats: allchats });

    } catch (error) {
        next(error);
    }
}

async function getallusermessage(req, res, next) {
    try {
        let { chatid } = req.params;
        let userid = req.user._id;
        let allmessages = await messagemodel.find({ userid: userid, chatid: chatid });

        if (!allmessages || allmessages.length === 0) {
            return res.status(401).json({ message: 'unathorised access!' });
        }

        res.status(200).json({ message: 'getting all messages!', allmessages: allmessages });

    } catch (error) {
        next(error);
    }
}

async function deletehistory(req, res, next) {
    try {
        let { chatid } = req.params;
        let userid = req.user._id;

        let chat = await chatmodel.deleteOne({ _id: chatid, user: userid });

        if (chat.deletedCount === 0) {
            return res.status(401).json({ message: 'unthorised access!' });
        }

        await messagemodel.deleteMany({ chatid: chatid, userid: userid });
        res.status(204).json({ message: 'chat deleted!' });

    } catch (error) {
        next(error);
    }
}
module.exports = {
    mainchatfnc,
    getalluserchat,
    getallusermessage,
    deletehistory
}