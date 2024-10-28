const config = require('../config.json');
module.exports = async (message, args, accountsdata, client) => {
    let repliedTo;
    if (message.reference?.messageId) {
        try {
            repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        } catch (error) {
            return message.reply('Error: Could not fetch the referenced message.');
        }
    } else {
        return message.reply('Error: No message given.');
    }
    const targetChannelId = args[1].substring(2,21);
    if (!repliedTo) return message.reply('Error: No message given.');
    const member = await message.guild.members.fetch(repliedTo.author.id);
    if (!member.roles.cache.has(config.officer_roleId)) return message.reply('You do not have permission to run this command.');
    if (!targetChannelId) return message.reply('Error: No target channel given.');
    client.channels.cache.get(targetChannelId).send(repliedTo.content);
}