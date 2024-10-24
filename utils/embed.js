const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
module.exports = async (title, desc, fields) => {
    var message_embed = new MessageEmbed();
    message_embed.setColor(config.embedColor)
    for (let i = 0; i < fields.length; i++) {
        message_embed.addFields(fields[i])
    }
    message_embed.setTitle(title)
    message_embed.setDescription(desc)
    return { embeds: [message_embed] }
}