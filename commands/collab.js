const fetch = require('node-fetch');
const config = require('../config.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
module.exports = async (message, args, accountsdata) => {
    const accData = accountsdata[message.author.id];
    const repo = args[1];
    var username;
    if (!repo) return message.reply('Repository name not given. Usage: `.collab <repository name>`');
    if (!config.allowedRepos.includes(repo)) return message.reply('This repo is currently not open for collaboration.')
    if (!(accData && accData.github)) {
        return message.reply('GitHub username not found. Link your username with \`.github <username>\`');
    } else {
        username = accData.github
    }
    try {
        const response = await fetch(`https://api.github.com/repos/${config.repo_owner}/${repo}/collaborators/${username}`, {
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
}