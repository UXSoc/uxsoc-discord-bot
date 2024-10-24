const config = require('../config.json');
const embed = require('../utils/embed');

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
module.exports = async (message, args, accountsdata) => {
    message.channel.send(await embed("🤖 UXBot Commands", "", command_fields))
};