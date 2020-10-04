const isDev = process.env.NODE_ENV === 'production';

module.exports = {
  jwtSecret: isDev ? process.env.JWT_SECRET : 'secretphrase',
  appPort: isDev ? process.env.PORT : 3000,
  mongoUrl: isDev ? process.env.MONGO_DB : 'mongodb://localhost:27017/diplom',
};
