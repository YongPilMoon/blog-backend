require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const cors = require('@koa/cors');

const {
  PROT: port = 4000,
  MONGO_URI: mongoURI,
  COOKIE_SIGN_KEY: signKey,
} = process.env;

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(mongoURI, {
}).then((response) => {
  console.log('Successfully connected to mongodb');
}).catch((e) => {
  console.log(e);
});


app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(bodyParser());

const sessionConfig = {
  maxAge: 86400000,
};

app.use(session(sessionConfig, app));
app.keys = [signKey];

app.use(router.routes())
  .use(router.allowedMethods());

router.use('/api', api.routes());

app.listen(port, () => {
  console.log('heurm server is listening to port 4000');
});


