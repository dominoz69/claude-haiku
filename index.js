const express = require('express');
const axios = require('axios');
const random = require('random-useragent');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/chat', async (req, res) => {
    const uid = req.query.uid;
    const query = req.query.q || "yo";

    if (!uid || !query) {
        return res.status(400).send('Missing required parameters: uid or q');
    }

    const payload = {
        messages: [
            {
                role: "user",
                content: query,
                id: uid
            }
        ],
        agentMode: {},
        id: uid,
        previewToken: null,
        userId: null,
        codeModelMode: true,
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: null,
        maxTokens: 1024,
        playgroundTopP: null,
        playgroundTemperature: null,
        isChromeExt: false,
        githubToken: "",
        clickedAnswer2: false,
        clickedAnswer3: false,
        clickedForceWebSearch: false,
        visitFromDelta: false,
        isMemoryEnabled: false,
        mobileClient: false,
        userSelectedModel: null,
        validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
        imageGenerationMode: false,
        webSearchModePrompt: false,
        deepSearchMode: false,
        domains: null,
        vscodeClient: false,
        codeInterpreterMode: false,
        customProfile: {
            name: "",
            occupation: "",
            traits: [],
            additionalInfo: "",
            enableNewChats: false
        },
        session: null,
        isPremium: true,
        subscriptionCache: null,
        beastMode: false
    };

    const headers = {
        'Authority': 'www.blackbox.ai',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Length': JSON.stringify(payload).length.toString(),
        'Origin': 'https://www.blackbox.ai',
        'Pragma': 'no-cache',
        'Referer': 'https://www.blackbox.ai/',
        'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': random.getRandom()
    };

    try {
        const response = await axios.post('https://www.blackbox.ai/api/chat', payload, { headers });
        let responseData = response.data;
        const urls = [];

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = responseData.match(urlRegex);

        if (matches) {
            urls.push(...matches);
            responseData = responseData.replace(urlRegex, ''); 
        }

        res.json({
            response: responseData.trim(),
            urls: urls
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            res.status(403).send('Bad Request');
        } else {
            res.status(500).send(error.message);
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
