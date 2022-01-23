const { Sequelize, DataTypes } = require('sequelize');

exports.config = {
    port: 8080,
    host: '0.0.0.0',
    upstream: 'https://apac-v7-sandbox.aarenet.com',

};

exports.sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/api-proxy.sqlite'
});

