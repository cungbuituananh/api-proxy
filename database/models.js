const { INTEGER } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../config');

exports.User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pbxId: {
        type: Sequelize.INTEGER,
        field: 'pbx_id'
    },
    userId: {
        type: Sequelize.INTEGER,
        field: 'user_id'
    }
}, {
    timestamps: false
});

exports.Attribute = sequelize.define('attribute', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pbxId: {
        type: Sequelize.INTEGER,
        field: 'pbx_id'
    },
    extensionId: {
        type: Sequelize.INTEGER,
        field: 'extension_id'
    },
    extension: {
        type: Sequelize.INTEGER,
        field: 'extension'
    },
    externalChannelId: {
        type: Sequelize.INTEGER,
        field: 'external_channel_id'
    },
    externalChannel: {
        type: Sequelize.INTEGER,
        field: 'external_channel'
    },
    channelId: {
        type: Sequelize.INTEGER,
        field: 'channel_id'
    },
    channel: {
        type: Sequelize.INTEGER,
        field: 'channel'
    }
}, {
    timestamps: false
});

//SQLite

// CREATE TABLE users (id integer PRIMARY KEY AUTOINCREMENT, pbx_id integer,user_id integer);
// CREATE TABLE attributes (id integer PRIMARY KEY AUTOINCREMENT, pbx_id integer, extension_id integer, extension integer, external_channel_id integer, external_channel integer, channel_id integer, channel integer);

//MySQL

// DROP TABLE IF EXISTS `users`;
// CREATE TABLE `users` (
//   `id` bigint(20) NOT NULL AUTO_INCREMENT,
//   `pbx_id` bigint(20) DEFAULT NULL,
//   `user_id` bigint(20) DEFAULT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// DROP TABLE IF EXISTS `attributes`;
// CREATE TABLE `attributes` (
//   `id` bigint(20) NOT NULL AUTO_INCREMENT,
//   `pbx_id` bigint(20) DEFAULT NULL,
//   `extension_id` bigint(20) DEFAULT NULL,
//   `extension` bigint(20) DEFAULT NULL,
//   `external_channel_id` bigint(20) DEFAULT NULL,
//   `external_channel` bigint(20) DEFAULT NULL,
//   `channel_id` bigint(20) DEFAULT NULL,
//   `channel` bigint(20) DEFAULT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


//Postgres

// CREATE TABLE `users` (
//   `id` SERIAL PRIMARY KEY,
//   `pbx_id` int(20) DEFAULT NULL,
//   `user_id` int(20) DEFAULT NULL
// )

// CREATE TABLE `attributes` (
//   `id` SERIAL PRIMARY KEY,
//   `pbx_id` int(20) DEFAULT NULL,
//   `extension_id` int(20) DEFAULT NULL,
//   `extension` int(20) DEFAULT NULL,
//   `external_channel_id` int(20) DEFAULT NULL,
//   `external_channel` int(20) DEFAULT NULL,
//   `channel_id` int(20) DEFAULT NULL,
//   `channel` int(20) DEFAULT NULL
// )
