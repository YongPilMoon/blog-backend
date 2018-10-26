const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../../token.json');

const Post = require('../../models/post');
const Joi = require('joi');

exports.write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    published: Joi.boolean().required(),
    mainImg: Joi.string(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    title, body, tags, mainImg, published,
  } = ctx.request.body;

  const post = new Post({
    title, body, tags, mainImg, published,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.list = async (ctx) => {
  const page = parseInt(ctx.query.page || 1, 10);
  const { tag } = ctx.query;
  const { token: userToken } = ctx.request.header;
  const { token } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const POST_COUNT_ONE_PAGE = 7;
  const query = {};

  if (tag) {
    query.tags = tag;
  }

  if(userToken !== token) {
    query.published = true;
  }

  console.log(query);
  if(page < 1) {
    ctx.status = 400;
    return;
  }

  console.log(page)
  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(POST_COUNT_ONE_PAGE)
      .skip((page - 1) * POST_COUNT_ONE_PAGE)
      .lean()
      .exec();
    const postCount = await Post.count(query).exec();
    console.log(posts);
    const limitBodyLength = post => ({
      ...post,
      body: post.body.length < 100 ? post.body : `${post.body.slice(0, 100)}...`,
    });
    ctx.body = posts.map(limitBodyLength);
    ctx.set('Last-page', Math.ceil(postCount / POST_COUNT_ONE_PAGE));
    ctx.set('Is-last', page * POST_COUNT_ONE_PAGE >= postCount);
  } catch (e) {
    ctx.throw(500, e);
  }
};

exports.read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();

    if(!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.update = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();

    if(!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.checkLogin = (ctx, next) => {
  const { token: userToken } = ctx.request.header;
  const { token } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if(userToken !== token) {
    ctx.status = 401;
    return null;
  }
  return next();
};
