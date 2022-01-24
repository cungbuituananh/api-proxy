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

// CREATE TABLE users (id integer PRIMARY KEY AUTOINCREMENT, pbx_id integer,user_id integer);
// CREATE TABLE attributes (id integer PRIMARY KEY AUTOINCREMENT, pbx_id integer, extension_id integer, extension integer, external_channel_id integer, external_channel integer, channel_id integer, channel integer);