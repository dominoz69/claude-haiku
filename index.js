const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/chat', async (req, res) => {
    const query = req.query.query; 
    const payload = {
        model: "o3-mini",
        messages: [
            {
                role: "user",
                content: query
            }
        ]
    };
    const headers = {
        'X-Vqd-4': '4-130280660404199472987102188598514176547',
        'X-Vqd-Hash-1': 'eyJzZXJ2ZXJfaGFzaGVzIjpbIm82N1VMRXBWbXJ4U2trVzNyeDF1Smp0NUt1S0pqNGxlZHNGakN6U04xNWM9IiwiUEtsWjB3L3lRZkxmc2R4S2MxblIxZjZFUWY1bUJDU3dadTc2eDRFSkM2MD0iXSwiY2xpZW50X2hhc2hlcyI6WyJiYXBvUFM1ZlR1NEx2ZjU1Y2JEUXVPaDZaRnlXSkMzaGV5TUh3bzRxK1N3PSIsIm5oTFNiTmU1RzN5djVDU096Y2ZjQ0NqcUFOQ2hhK3RvY0VxU08raXp5Z1E9Il0sInNpZ25hbHMiOnt9fQ==',
        'Origin': 'https://duckduckgo.com',
        'Pragma': 'no-cache',
        'Referer': 'https://duckduckgo.com/',
        'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post('https://duckduckgo.com/duckchat/v1/chat', payload, { headers });

        const cleanResponse = parseStreamingResponse(response.data);
        res.json({ response: cleanResponse });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            res.status(403).send('Bad Request');
        } else {
            res.status(500).send(error.message);
        }
    }
});

function parseStreamingResponse(streamData) {
    const lines = streamData.split('\n\n');
    let fullMessage = '';

    for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
                const jsonData = JSON.parse(line.substring(6));
                if (jsonData.message) {
                    fullMessage += jsonData.message;
                }
            } catch (e) {
                continue;
            }
        }
    }

    return fullMessage;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
