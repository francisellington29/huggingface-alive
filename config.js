// require('dotenv').config(); // 确保加载 .env 文件中的变量

module.exports = {
    port: process.env.PORT || 3000,

    my_url: process.env.MY_URL || '',
    seconds: parseInt(process.env.SECONDS, 10) || 120,

    web: process.env.WEB || '',
    data: process.env.DATA || '',

    cf: process.env.CF || '',
    cf_url: process.env.CF_URL || '',
    label: process.env.LABEL || ''
};
