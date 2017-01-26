const production = process.env.NODE_ENV === 'production';

module.exports = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: production ? '0.0.0.0' : '127.0.0.1',
};
