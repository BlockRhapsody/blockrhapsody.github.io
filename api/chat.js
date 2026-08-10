// api/chat.js
// Vercel Serverless Function - 代理 DeepSeek API 请求

export default async function handler(req, res) {
    // 1. 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. 从环境变量读取 API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured' });
    }

    // 3. 获取前端传来的消息
    const { messages, model = 'deepseek-chat', temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'messages is required and must be an array' });
    }

    try {
        // 4. 调用 DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: temperature,
                max_tokens: 4096,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            return res.status(response.status).json({
                error: 'DeepSeek API error',
                detail: errorData
            });
        }

        const data = await response.json();

        // 5. 返回结果给前端
        return res.status(200).json({
            content: data.choices[0].message.content,
            usage: data.usage
        });

    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
