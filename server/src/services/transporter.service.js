let nodemailer = require('nodemailer')
let { google } = require('googleapis')
let jwt = require('jsonwebtoken')

let oauth2 = google.auth.OAuth2;

async function transporterfnc() {
    try {

        let authmessage = new oauth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        )

        let refreshtoken = authmessage.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        })

        let accesstoken = await new Promise((res, rej) => {
            authmessage.getAccessToken((err, token) => {
                if (err) {
                    console.error("auth error details", err);
                    rej('Not getting access token!');
                } else {
                    res(token);
                }
            });
        });


        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                accessToken: accesstoken,
                refreshToken: process.env.REFRESH_TOKEN,
                user: process.env.SENDER_EMAIL
            }
        })

        return transporter

    } catch (error) {
        console.log(error)
        throw error
    }
}


async function welcomemessagefnc(username, usermail) {
    try {

        let transporter = await transporterfnc()

        if (!transporter) {
            console.log("Transporter create nahi hua, mail cancel.");
            return;
        }

        let emailtoken = await jwt.sign({
            usermail: usermail
        }, process.env.JWT_KEY)

        let mailresponse = {
            from: process.env.SENDER_EMAIL,
            to: usermail,
            subject: 'thanks for signign up!',
            html: `<h2 style="font-size: 20px; font-weight: bold; text-transform: capitalize;">hello ${username},</h2></br> <p style="font-size: 15px; font-weight: medium; text-transform: capitalize;">thanks for signup! your verify button is here</p></br> <button style="font-size: 15px; font-weight: medium; text-transform: uppercase; color: blue;padding:5px 15px"><a style=" text-decoration: none; border:none; boder-radius:5px;" href="http://localhost:8080/api/verify?token=${emailtoken}">verify</a></button> <button style="font-size: 15px; font-weight: medium; text-transform: uppercase; color: blue;padding:5px 15px"><a style=" text-decoration: none; border:none; boder-radius:5px;" href="http://localhost:8080/api/resend?token=${emailtoken}">resend</a></button>`
        }

        let response = await transporter.sendMail(mailresponse)

        console.log(response)

    } catch (error) {
        console.log(error)
    }
}


module.exports = welcomemessagefnc