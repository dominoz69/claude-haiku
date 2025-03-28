const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/chat', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).send('Query parameter is required');

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
        'Accept': 'text/event-stream',
        'Origin': 'https://duckduckgo.com',
        'Referer': 'https://duckduckgo.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('https://duckduckgo.com/duckchat/v1/chat', payload, {
            headers: headers,
            responseType: 'stream'
        });

        let fullMessage = '';
        response.data.on('data', chunk => {
            const str = chunk.toString();
            if (str.startsWith('data: ') && str !== 'data: [DONE]') {
                try {
                    const data = JSON.parse(str.substring(6));
                    if (data.message) fullMessage += data.message;
                } catch (e) {}
            }
        });

        response.data.on('end', () => {
            res.json({ response: fullMessage });
        });

    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
