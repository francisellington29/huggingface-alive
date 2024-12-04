const path = require('path');

const express = require('express');
const { create } = require('express-handlebars');

const config = require('./config');

const port = config.port

const app = express();
const hbs = create({
  layoutsDir: 'views',
  extname: '.html',
  defaultLayout: false // 禁用默认布局
});

// 设置 Handlebars 引擎
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// 配置静态文件服务
app.use('/static', express.static(path.join(__dirname, 'static')));

// 引入路由
const scratchTicket = require('./routes/scratchTicket');
const myRoutes = require('./routes/my');
const cfRoutes = require('./routes/cf');

app.use('/scratch-ticket', scratchTicket);

app.use('/my', myRoutes);

app.use('/cf', cfRoutes);

app.get('/', (req, res) => {
  res.render('index');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


require('./scheduler');