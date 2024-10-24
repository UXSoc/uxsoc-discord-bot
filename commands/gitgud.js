const fetch = require('node-fetch');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
module.exports = async (message, args, accountsdata) => {
    const accData = accountsdata[message.author.id];
    const pullrequrl = args[1];
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
        if (baseBranch !== 'staging') return message.reply(`Invalid pull request. This pull request wants to merge into __${baseBranch}__ instead of __staging__.`);
        if  (username !== accData.github) return message.reply(`Pull request author mismatch. Owned by __${username}__ instead of __${accData.github}__.`);
        await message.member.roles.add("1294311955401674762");
        message.reply(`Congratulations **${message.member.nickname}**! You're now git good 🎉! You can now contribute to community projects!`)
    } catch (error) {
        return message.reply(`An error occurred. ${error}`)
    }
}