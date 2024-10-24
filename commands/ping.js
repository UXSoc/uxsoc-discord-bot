module.exports = async (message, args, accountsdata) => {
    const msg = await message.channel.send('Pinging...');
    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);
    await msg.edit(`Pong! 🏓\nLatency: \`${latency}ms\`. API Latency: \`${apiLatency}ms\``);
};