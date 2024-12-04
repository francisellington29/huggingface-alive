const axios = require('axios');
const moment = require('moment-timezone');
const cron = require('node-cron');

const config = require('./config');

const port = config.port
const intervalInMilliseconds = config.seconds * 1000
const webpages = config.my_url.split(';').map(url => `https://${url}`)

console.log('--------------------------------');
console.log(webpages);
console.log('--------------------------------');

// 访问网页函数
const visit = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Web visited successfully: ${url} --- status：${response.status}`);
    } catch (error) {
        console.error(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Failed to visit ${url}, Error ${error.message}`);
    }
};

const visitAll = async () => {
    for (let url of webpages) {
        await visit(url);
    }
};

setInterval(async function () {
    try {
        const response = await axios.get(`http://127.0.0.1:${port}/`);
        console.log('Received response: ' + response.status);
    } catch (error) {
        console.error('Error: ' + error.message);
    }
}, intervalInMilliseconds);

// 使用 cron 定时访问
cron.schedule('*/2 * * * *', visitAll); // 每2分钟执行一次
