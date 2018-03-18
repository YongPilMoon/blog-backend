const Post = require('../../models/post');
const Joi = require('joi');

const { ObjectId } = require('mongoose').Types;

const postId = 1;

exports.write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  const post = new Post({
    title, body, tags,
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

  if(page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag } = ctx.query;

  const query = tag ? {
    tags: tag,
  } : {};

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.count(query).exec();
    const limitBodyLength = post => ({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    });
    ctx.body = posts.map(limitBodyLength);
    ctx.set('Last-page', Math.ceil(postCount / 10));
  } catch (e) {
    ctx.throw(500, e);
  }
};

// exports.read = (ctx) => {
//   const { id } = ctx.params;
//
//   const post = posts.find(p => p.id.toString() === id);
//
//   if(!post) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//   }
//
//   ctx.body = post;
// };
//
// exports.remove = (ctx) => {
//   const { id } = ctx.params;
//
//   const index = posts.findIndex(p => p.id.toString() === id);
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습ㄴ디ㅏ.',
//     };
//     return;
//   }
//
//   posts.splice(index, 1);
//   ctx.status = 204;
// };
//
// exports.replace = (ctx) => {
//   const { id } = ctx.params;
//
//   const index = posts.findIndex(p => p.id.toString() === id);
//
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//
//   posts[index] = {
//     id,
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// };
//
// exports.update = (ctx) => {
//   const { id } = ctx.params;
//
//   const index = posts.findIndex(p => p.id.toString() === id);
//
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//
//   posts[index] = {
//     ...posts[index],
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// };