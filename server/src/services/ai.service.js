let { HumanMessage, SystemMessage, AIMessage } = require('@langchain/core/messages');
let { tool } = require('@langchain/core/tools');
let z = require('zod');
const tavilyresponse = require('./tavily.service');
let { ChatOpenAI } = require('@langchain/openai'); // OpenRouter ke liye OpenAI use hota hai
let { createReactAgent } = require('@langchain/langgraph/prebuilt');

let openRouterModel = new ChatOpenAI({
    apiKey: process.env.OPENROUTER_KEY, 
    configuration: {
        baseURL: "https://openrouter.ai/api/v1", 
        defaultHeaders: {
            "HTTP-Referer": "https://deploy-simple-chatbot.vercel.app/", 
            "X-Title": "Express Chatbot"
        }
    },
    modelName: 'inclusionai/ling-3.0-flash-sante:free', 
    temperature: 0.7
});

let searchtool = tool(
    async ({ search }) => { 
        return tavilyresponse(search);
    }, {
    name: 'search_data',
    description: 'Use this tool when you need current data for the response or for cross verifying.',
    schema: z.object({
        search: z.string().describe(`here's the user query in string format`)
    }),
});

let agent = createReactAgent({
    llm: openRouterModel,
    tools: [searchtool]
});


async function generatetitle(message) {
    console.log("Generating Title for:", message);
    try {
        let response = await openRouterModel.invoke([
            new SystemMessage('Generate a 3-5 words title for this message. Only return the title, no extra text.'),
            new HumanMessage(message)
        ]);

        console.log("Title generated:", response.content);
        return response.content;

    } catch (error) {
        console.log("Error in generatetitle:", error);
        throw error;
    }
}


async function generatecontent(messagesHistory) {
    try {
        console.log('Running generate content fnc!');

        const formattedMessages = messagesHistory.map((val) => {
            if (val.role === 'user') {
                return new HumanMessage(val.content);
            } else {
                return new AIMessage(val.content);
            }
        });

        let eventStream = await agent.stream(
            { messages: formattedMessages },
            { streamMode: "values" } 
        );

        return eventStream;

    } catch (error) {
        console.log("Error in generatecontent:", error);
        throw error;
    }
}

module.exports = {
    generatetitle, generatecontent
}