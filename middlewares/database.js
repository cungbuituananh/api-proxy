const { User, Attribute } = require('../database/models');

exports.syncUser = async (req, res, next) => {
    console.log('res.response', res.response)
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
    const attributes = res.response.data.orgUnitAttributes;
    const pbxId = attributes[0].orgUnitId;

    const extension = attributes.find(item => item.name == 'maxExtensions');
    const externalChannel = attributes.find(item => item.name == 'maxExternalChannels');
    const channel = attributes.find(item => item.name == 'maxChannels');

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
