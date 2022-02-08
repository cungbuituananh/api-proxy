const { Sequelize, DataTypes } = require('sequelize');

exports.config = {
    port: 8080,
    host: '0.0.0.0',
    upstream: 'https://apac-v7-sandbox.aarenet.com',
    timeout: 10000
};

//SQLite
// exports.sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database/api-proxy.sqlite',
//     logging: true,
//     dialectOptions: {mode: 2}
// });


//MySQL
// exports.sequelize = new Sequelize('pbx', 'root', 'Welcome1', {
//     host: 'localhost',
//     port: '3306',
//     dialect: 'mysql',
//     operatorsAliases: false,
//     pool: {
//       max: 5,
//       min: 1,
//       acquire: 30000,
//       idle: 10000  
//     },
//     logging: false,
// });

exports.sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')