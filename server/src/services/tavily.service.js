let { tavily } = require('@tavily/core')

let tvly = tavily({ apiKey: process.env.TAVILY_API_KEY })

async function tavilyresponse(query) {
    try {

        console.log('running tavily')

        let data = await tvly.search(query.search)

        if (!data.results || data.results.length === 0) {
            return "No current data found for this query."
        }

        console.log('tavily response')
        console.log(JSON.stringify(data.results[0].content))

        return JSON.stringify(data.results[0].content)

    } catch (error) {
        console.log(error)
        return "Search failed, unable to fetch current data."
    }
}

module.exports = tavilyresponse