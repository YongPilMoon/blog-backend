require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI, {
}).then((response) => {
  console.log('Successfully connected to mongodb');
}).catch((e) => {
  console.log(e);
});
const port = process.env.PORT || 4000;

router.use('/api', api.routes());

app.use(bodyParser());

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(4000, () => {
  console.log('heurm server is listening to port 4000');
});


