let { HumanMessage, SystemMessage, AIMessage, tool, createAgent } = require('langchain')
let { ChatMistralAI } = require('@langchain/mistralai')
let { ChatGroq } = require('@langchain/groq')
let z = require('zod')
const tavilyresponse = require('./tavily.service')

let mistralmodel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_KEY,
    model: process.env.MISTRAL_MODEL,
    temperature: 0.7
})

let groqmodel = new ChatGroq({
    model: process.env.GROQ_MODEL,
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7
})

let searchtool = tool(
    async (search) => {
        return tavilyresponse(search)
    }, {
    name: 'search_data',
    description: 'use this tool when you need to want current data for the response or also use for accurate results and cross verifying',
    schema: z.object({
        search: z.string().describe(`here's the user query in string format`)
    }),
}
)

let agent = createAgent({
    model: mistralmodel,
    tools: [searchtool]
})

async function generatetitle(message) {
    try {

        let response = await mistralmodel.invoke([
            new SystemMessage('Generate a 3-5 words title for this message. Only return the title, no extra text.'),
            new HumanMessage(message)
        ])

        return response.content

    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function generatecontent(message) {
    try {

        console.log('running generate fnc!')

        let response = await agent.stream({
            messages: message.map((val) => {
                if (val.role === 'user') {
                    return new HumanMessage(val.content)
                } else {
                    return new AIMessage(val.content)
                }
            })
        })

        console.log('giving response!')
        console.log(response)

        return response

    } catch (error) {
        console.log(error)
        throw error;
    }
}


module.exports = {
    generatetitle, generatecontent
}