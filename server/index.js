const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./router');

mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true });

const app = express();
const port = process.env.PORT || 3090;

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

router(app);

//const server = http.createServer(app);

app.listen(port, () => {
    console.log('tá rodando!');
})