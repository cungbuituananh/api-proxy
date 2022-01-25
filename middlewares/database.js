const { User, Attribute } = require('../database/models');
const { callRequest } = require('../helpers/api');

exports.syncUser = async (req, res, next) => {
    const pbxId = res.response.data.orgUnitId;
    const userId = res.response.data.userId;

    if (pbxId && userId) {
        let user = await User.findOne({
            where: {
                pbxId,
                userId
            }
        });

        if (!user) {
            user = await User.create({ pbxId, userId });
        }
    }
    next();

};

exports.syncAttribute = async (req, res, next) => {
    const pbxId = req.body.orgUnitId;
    const response = await callRequest(req, "GET", `/rest/orgUnitAttributes?where=orgUnitId.eq(${pbxId})`);
    const attributes = response.data.orgUnitAttributes;

    const extension = attributes.sort((a,b) => b.id - a.id).find(item => item.name == 'maxExtensions');
    const externalChannel = attributes.sort((a,b) => b.id - a.id).find(item => item.name == 'maxExternalChannels');
    const channel = attributes.sort((a,b) => b.id - a.id).find(item => item.name == 'maxChannels');

    let attribute = await Attribute.findOne({
        where: {
            pbxId
        }
    });

    if (!attribute) {
        attribute = await Attribute.create({
            pbxId,
            extensionId: extension ? extension.id : null,
            extension: extension ? extension.value : null,
            externalChannelId: externalChannel ? externalChannel.id : null,
            externalChannel: externalChannel ? externalChannel.value : null,
            channelId: channel ? channel.id : null,
            channel: channel ? channel.value : null
        });
    }
    
    // else {
    //     await Attribute.update({
    //         extensionId: extension ? extension.id : null,
    //         extension: extension ? extension.value : null,
    //         externalChannelId: externalChannel ? externalChannel.id : null,
    //         externalChannel: externalChannel ? externalChannel.value : null,
    //         channelId: channel ? channel.id : null,
    //         channel: channel ? channel.value : null
    //     }, {
    //         where: {
    //             pbxId
    //         }
    //     });
    // }

    next();
};
