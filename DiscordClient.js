require('dotenv').config();
const ess = require('./ess.js');
const config = require('./config.json');
const fs = require("fs");
const { Client, Intents, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ENVIRONMENT = process.env.ENVIRONMENT;
const REPO_OWNER = config.repo_owner;
const accounts = "./accounts.json";
const embedColor = config.embedColor;
const PREFIX = (ENVIRONMENT=="DEV")?config.dev_prefix:config.prefix;
const announcement_hearts = config.announcement_reactions.hearts;
const announcement_reactions = config.announcement_reactions.normal;
const dev_channels = config.channels.dev;
const hype_channels = config.channels.hype;
const rules_channel = config.channels.rules;

const commands = [
    {
        name: "help",
        args: [],
        desc: "Show all commands"
    },
    {
        name: "github",
        args: ["username"],
        desc: "Link your github username"
    },
    {
        name: "collab",
        args: ["repository name"],
        desc: "Add yourself as a collaborator to a UXSoc repo"
    },
    {
        name: "gitgud",
        args: ["pull request url"],
        desc: "Verify that you\'ve completed the Git Gud workshop with your pull request to gain access to Community Projects"
    }
]
var command_fields = []
for (let i = 0; i < commands.length; i++) {
    var value = `__Usage:__ \`${PREFIX}${commands[i].name}`;
    for (let j = 0; j < commands[i].args.length; j++) {
        value += ` <${commands[i].args[j]}>`
    }
    value += '`\n'
    command_fields.push({
        name: `${PREFIX}${commands[i].name}`,
        value: value + commands[i].desc,
        inline: false
    })
}

var accountsdata;
fs.readFile(accounts, "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    accountsdata = JSON.parse(data);
});
function createEmbed(title, desc, fields) {
    var message_embed = new MessageEmbed();
    message_embed.setColor(embedColor)
    for (let i = 0; i < fields.length; i++) {
        message_embed.addFields(fields[i])
    }
    message_embed.setTitle(title)
    message_embed.setDescription(desc)
    return { embeds: [message_embed] }
}

client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => {
    console.log('UXBot connected and ready!');
    client.user.setActivity(config.activity.name, { type: config.activity.type })
})
async function removeReaction(user, message, emoji) {
    const fetchedMessage = await message.channel.messages.fetch(message.id);
    console.log("removing reaction")
    const toRemove = fetchedMessage.reactions.cache.find(r => r.emoji.name === emoji);
    if (toRemove) await toRemove.users.remove(user.id);
}
client.on('threadCreate', async (thread) => {
    if (thread.parent && thread.parent.type === "GUILD_FORUM") {
        if (thread.parentId === "1284767734256635976") {
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
    if (message.channel.parentId == "1284767734256635976") {
        const reactionEmoji = reaction.emoji.name;
        console.log(reactionEmoji)
        if (reactionEmoji == '🔥') {
            const guild = message.guild;
            const member = await guild.members.fetch(user.id);
            if (member.roles.cache.has("1294311955401674762") || member.roles.cache.has("1284754382205882388") || member.roles.cache.has("1284754282075390044") || member.roles.cache.has("1292074089715990549")) {
                await message.member.roles.add("1298964889498288198");
            } else {
                removeReaction(user, message, reactionEmoji);
            }
            return;
        }
        const thread = message.channel;
        var role = roleMapping[reactionEmoji];
        if (!role) return;
        const guild = message.guild;
        const member = await guild.members.fetch(user.id);
        if (member.roles.cache.has("1298964889498288198")) {
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
    if (message.channel.parentId == "1284767734256635976") {
        const reactionEmoji = reaction.emoji.name;
        if (reactionEmoji == '🔥') {
            await message.member.roles.remove("1298964889498288198");
            return;
        }
    }
});

client.on('messageCreate', async message => {
    if ((ENVIRONMENT=="DEV" && !dev_channels.includes(message.channelId))) return;
    console.log(`received message ${message.content} from ${message.author.username} on channel ${message.channelId}.`)
    var args = message.content.split(' ');
    var accData = accountsdata[message.author.id];
    if (hype_channels.includes(message.channelId)) {
        message.react(announcement_hearts[ess.randomIndex(announcement_hearts.length)]);
        for (let i = 0; i< ess.randInt(config.min_hype,config.max_hype); i++) message.react(announcement_reactions[ess.randomIndex(announcement_reactions.length)]);
    }
    if (!message.content.startsWith(PREFIX)) return;
    if (message.author.id == "1294906343421120532") return;
    switch(args[0].replace(PREFIX,"").toLowerCase()) {
        case "help":
            message.channel.send(createEmbed("🤖 UXBot Commands", "", command_fields))
            break;
        case "github":
            var username = args[1];
            var dscrd_username = message.author.username;
            var dscrd_nick = message.member.nickname;
            if (!username) return message.reply("Missing argument: username")
            if (!dscrd_nick || (dscrd_nick && (dscrd_nick.split(" ").length < 2))) {
                message.react('❌')
                return message.reply(`Please follow the server profile name format as seen in <#${rules_channel}> before linking to Github.`)
            }
            if (accountsdata[message.author.id] === undefined) {
                accountsdata[message.author.id] = {
                    "github": username,
                    "username": dscrd_username,
                    "nickname": dscrd_nick
                }
            } else {
                accountsdata[message.author.id].github = username
                accountsdata[message.author.id].username = dscrd_username
                accountsdata[message.author.id].nickname = dscrd_nick
            }
            fs.writeFile(accounts, JSON.stringify(accountsdata, null, 4), 'utf8', function() {
                message.reply(`Github username updated.`)
            });
            break;
        case "collab":
            var repo = args[1];
            var username
            if (!repo) return message.reply('Repository name not given. Usage: `.collab <repository name>`');
            if (!config.allowedRepos.includes(repo)) return message.reply('This repo is currently not open for collaboration.')
            if (!(accData && accData.github)) {
                return message.reply('GitHub username not found. Link your username with .github <username>');
            } else {
                username = accData.github
            }
            try {
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${repo}/collaborators/${username}`, {
                    method: 'PUT',
                    headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    },
                    body: JSON.stringify({
                        permission: 'push'
                    })
                });
                if (response.ok) {
                    message.reply(`Successfully invited **${username}** to be a collaborator on the **${repo}** repo! Please check your associated email to accept the invitation.`);
                } else {
                    const error = await response.json();
                    message.reply(`Error: ${error.message}`);
                }
            } catch (err) {
                console.error(err);
                message.reply('Failed to add collaborator.');
            }
            break;
        case "gitgud":
            var pullrequrl = args[1];
            if (!pullrequrl) return message.reply("Missing pull request url. Usage: `.gitgud <pull request url>`");
            if (!accData) return message.reply('GitHub username not found. Link your username with .github <username>');
            if (!pullrequrl.startsWith("https://github.com/UXSoc/uxsoc-engineering-pool-2425/pull/")) return message.reply("Invalid pull request url.");
            var pullreqid = pullrequrl.split("/")[6]
            var apiUrl = `https://api.github.com/repos/UXSoc/uxsoc-engineering-pool-2425/pulls/${pullreqid}`;
            try {
                var response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                });
                if (!response.ok) {
                    return message.reply(`An error occurred. ${response.statusText}`)
                }
                var prData = await response.json()
                var username = prData.user.login
                var baseBranch = prData.base.ref
                if (!accData) return message.reply('GitHub username not found. Link your username with .github <username>');
                if (baseBranch !== 'staging') return message.reply(`Invalid pull request. This pull request wants to merge into __${baseBranch}__ instead of __staging__.`);
                if  (username !== accData.github) return message.reply(`Pull request author mismatch. Owned by __${username}__ instead of __${accData.github}__.`);
                await message.member.roles.add("1294311955401674762");
                message.reply(`Congratulations **${username}**! You're now git good 🎉! You can now contribute to community projects!`)
            } catch (error) {
                return message.reply(`An error occurred. ${error}`)
            }
            break;
        case 'ping':
            const msg = await message.channel.send('Pinging...');
            const latency = msg.createdTimestamp - message.createdTimestamp;
            const apiLatency = Math.round(client.ws.ping);
            return await msg.edit(`Pong! 🏓\nLatency: \`${latency}ms\`. API Latency: \`${apiLatency}ms\``);
    }
});
