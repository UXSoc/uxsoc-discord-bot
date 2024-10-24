require('dotenv').config();
const fetch = require('node-fetch');
const ess = require('./utils/ess');
const config = require('./config.json');
const fs = require("fs");
const { Client, Intents } = require('discord.js');
const { handleCommand } = require('./commands/commandHandler');

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const ENVIRONMENT = process.env.ENVIRONMENT;
const accounts = "./accounts.json";
const PREFIX = (ENVIRONMENT=="DEV")?config.dev_prefix:config.prefix;
const announcement_hearts = config.announcement_reactions.hearts;
const announcement_reactions = config.announcement_reactions.normal;
const dev_channels = config.channels.dev;
const hype_channels = config.channels.hype;

var accountsdata;
fs.readFile(accounts, "utf8", (error, data) => {
    if (error) {
      console.error(error);
      return;
    }
    accountsdata = JSON.parse(data);
});

client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => {
    if (ENVIRONMENT == "DEV") console.log("Started in Developer Mode")
    console.log('UXBot connected and ready!');
    client.user.setActivity(config.activity.name, { type: config.activity.type })
})
async function removeReaction(user, message, emoji) {
    const fetchedMessage = await message.channel.messages.fetch(message.id);
    const toRemove = fetchedMessage.reactions.cache.find(r => r.emoji.name === emoji);
    if (toRemove) await toRemove.users.remove(user.id);
}
client.on('threadCreate', async (thread) => {
    if (thread.parent && thread.parent.type === "GUILD_FORUM") {
        if (thread.parentId === config.channels.projects) {
            try {
                const messages = await thread.messages.fetch({ limit: 1 });
                const firstMessage = messages.first();
                if (firstMessage) {
                    firstMessage.react('🔥');
                }
                var rolemsg = await thread.send("**React with the following if you’re interested:**\n     • 🎨 for Designers\n     • 💻 for Developers")
                await rolemsg.react('💻')
                await rolemsg.react('🎨')
            } catch (error) {
                console.error('Error fetching or reacting to the first post:', error);
            }
        }
    }
});
const roleMapping = {
    '🎨': '🎨designer',
    '💻': '💻developer'
};
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong fetching the reaction:', error);
            return;
        }
    }
    if (user.bot) return;
    const message = reaction.message;
    if (message.channel.parentId == config.channels.projects) {
        const reactionEmoji = reaction.emoji.name;
        const member = await message.guild.members.fetch(user.id);
        if (reactionEmoji == '🔥') {
            if (member.roles.cache.has("1294311955401674762") || member.roles.cache.has("1284754382205882388") || member.roles.cache.has("1284754282075390044") || member.roles.cache.has("1292074089715990549")) {
                await member.roles.add(config.allow_project_join_role);
            } else {
                removeReaction(user, message, reactionEmoji);
            }
            return;
        }
        const thread = message.channel;
        var role = roleMapping[reactionEmoji];
        if (!role) return;
        if (member.roles.cache.has(config.allow_project_join_role)) {
            const nickname = member.nickname || user.username;
            await thread.send(`**${nickname}** joined as a \`${role}\``);
        } else {
            removeReaction(user, message, reactionEmoji);
        }
    }
});
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong fetching the reaction:', error);
            return;
        }
    }
    if (user.bot) return;
    const message = reaction.message;
    if (message.channel.parentId == config.channels.projects) {
        const reactionEmoji = reaction.emoji.name;
        if (reactionEmoji == '🔥') {
            const member = await message.guild.members.fetch(user.id);
            await member.roles.remove(config.allow_project_join_role);
            return;
        }
    }
});
client.on('messageCreate', async (message) => {
    if ((ENVIRONMENT=="DEV" && !dev_channels.includes(message.channelId))) return;
    if (!message.content.startsWith(PREFIX)) return;
    if (message.author.bot) return;
    if (hype_channels.includes(message.channelId)) {
        message.react(announcement_hearts[ess.randomIndex(announcement_hearts.length)]);
        for (let i = 0; i< ess.randInt(config.min_hype,config.max_hype); i++) message.react(announcement_reactions[ess.randomIndex(announcement_reactions.length)]);
    }
    console.log(`[COMMAND] ${message.content} from ${message.author.username} on #${message.channel.name}.`)
    await handleCommand(message, accountsdata);
});