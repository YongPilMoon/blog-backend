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


app.use((ctx, next) => {
  const allowedHosts = [
    'localhost:3000',
  ];
  const origin = ctx.header.origin;
  allowedHosts.every((el) => {
    if(!origin) return false;
    if(origin.indexOf(el) !== -1) {
      ctx.response.set('Access-Control-Allow-Origin', origin);
      return false;
    }
    return true;
  });
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-timebase, Link');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
  ctx.set('Access-Control-Expose-Headers', 'Link');
  return next();
});

const port = process.env.PORT || 4000;

router.use('/api', api.routes());

app.use(bodyParser());

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(4000, () => {
  console.log('heurm server is listening to port 4000');
});


