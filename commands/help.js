const config = require('../config.json');
const embed = require('../utils/embed');

const global_commands = [
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
const admin_commands = [
    {
        name: "broadcast",
        args: ["channel"],
        desc: "Broadcast to a channel by replying to the message."
    },
    {
        name: "ping",
        args: [],
        desc: "Ping UXBot."
    }
]
function createHelpFields(commands) {
    var command_fields = [];
    for (let i = 0; i < commands.length; i++) {
        var value = `__Usage:__ \`${config.prefix}${commands[i].name}`;
        for (let j = 0; j < commands[i].args.length; j++) {
            value += ` <${commands[i].args[j]}>`
        }
        value += '`\n'
        command_fields.push({
            name: `${config.prefix}${commands[i].name}`,
            value: value + commands[i].desc,
            inline: false
        })
    }
    return command_fields;
}
module.exports = async (message, args, accountsdata, client) => {
    const member = await message.guild.members.fetch(message.author.id);
    message.channel.send(await embed("🤖 UXBot Commands", "", (member.roles.cache.has(config.officer_roleId))?createHelpFields(global_commands.concat(admin_commands)):createHelpFields(global_commands)))
};