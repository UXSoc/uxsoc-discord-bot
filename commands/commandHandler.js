const ping = require('./ping');
const help = require('./help');
const github = require('./github');
const gitgud = require('./gitgud');
const collab = require('./collab');
const broadcast = require('./broadcast');

const commands = {
    ping,
    help,
    github,
    gitgud,
    collab,
    broadcast
};

async function handleCommand(message, accountsdata, client) {
    const args = message.content.split(' ');
    const commandName = args[0].slice(1).toLowerCase();

    if (commands[commandName]) {
        await commands[commandName](message, args, accountsdata, client);
    }
}

module.exports = { handleCommand };
