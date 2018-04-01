const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');


const posts = new Router();

posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.read);

posts.post('/', postsCtrl.checkLogin, postsCtrl.write);
posts.delete('/:id', postsCtrl.checkLogin, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkLogin, postsCtrl.update);

module.exports = posts;
