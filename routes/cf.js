const axios = require('axios');
const express = require('express');
const router = express.Router();

const config = require('../config');

// 延迟函数（返回一个 Promise，用于在请求之间添加延迟）
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 带重试的请求函数
const visitWithRetry = async (url, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return response.data;  // 如果成功，返回数据
        } catch (error) {
            console.error(`Error visiting ${url}, attempt ${attempt}/${retries}: ${error.message}`);
            if (attempt === retries) {
                throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
            }
            await delay(1000);  // 重试前等待 1 秒
        }
    }
};

router.get('/', async (req, res) => {
    const cf = config.cf;
    const query = req.query.cf;

    if (query === cf) {
        const url_list_str = config.cf_url;
        const url_list = url_list_str.split(';').map(url => `https://${url}`);

        const data_list = [];
        const label = config.label;

        for (let url of url_list) {
            try {
                const base64String = await visitWithRetry(url); // 使用重试机制请求数据
                const data = Buffer.from(base64String, 'base64').toString('utf-8');
                data_list.push(data);
                data_list.push(label);

                await delay(500);  // 每次请求后延迟 500 毫秒（0.5 秒）
            } catch (error) {
                console.error(`Error processing URL ${url}: ${error.message}`);
            }
        }

        data_list.pop(); // 移除最后一个 label
        const base64 = Buffer.from(data_list.join('\n'), 'utf-8').toString('base64');
        res.send(base64);
    } else {
        res.render('fish');
    }
});


module.exports = router;