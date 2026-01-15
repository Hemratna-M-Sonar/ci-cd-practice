require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    nodeEnv: process.env.NODE_ENV || 'development'
};
