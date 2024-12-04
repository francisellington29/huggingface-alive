const express = require('express');
const router = express.Router();

const config = require('../config');

router.get('/', (req, res) => {
    const web = config.web;
    const query = req.query.web

    // 根据查询参数的值进行不同的逻辑处理
    if (query === web) {
        const data = config.data
        const base64 = Buffer.from(data, 'utf-8').toString('base64');
        res.send(base64);
    } else {
        res.render('fish');
    }
});

module.exports = router;
