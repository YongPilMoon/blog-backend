const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../../token.json');

const shortid = require('shortid');

const { ADMIN_PASS: adminPass } = process.env;

exports.login = (ctx) => {
  const { password } = ctx.request.body;
  if (adminPass === password) {
    const adminToken = shortid.generate();
    fs.writeFileSync(filePath, JSON.stringify({ token: adminToken }), 'utf8');
    ctx.set('Token', adminToken);
    ctx.body = {
      success: true,
    };
  } else {
    ctx.body = {
      success: false,
    };
    ctx.status = 401;
  }
};

exports.check = (ctx) => {
  const { token: userToken } = ctx.request.header;
  const { token } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if(userToken === token) {
    ctx.body = {
      logged: true,
    };
  } else {
    ctx.body = {
      logged: false,
    };
  }
};

exports.logout = (ctx) => {
  fs.writeFileSync(filePath, JSON.stringify({ token: '' }), 'utf8');
  ctx.status = 204;
};

