const fs = require("fs");
const config = require('../config.json');
module.exports = async (message, args, accountsdata) => {
    var username = args[1];
    var dscrd_username = message.author.username;
    var dscrd_nick = message.member.nickname;
    if (!username) return message.reply("Missing argument: username")
    if (!dscrd_nick || (dscrd_nick && (dscrd_nick.split(" ").length < 2))) {
        message.react('❌')
        return message.reply(`Please follow the server profile name format as seen in <#${config.channels.rules}> before linking to Github.`)
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
    fs.writeFile("./accounts.json", JSON.stringify(accountsdata, null, 4), 'utf8', function() {
        message.reply(`Github username updated.`)
    });
}