const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    category: 'misc',
    aliases: ['p', 'pong'],
    async execute(message) {
        const m = await message.channel.send("Ping?");
        m.edit(
        `✨ Pong! Latency is **${
            m.createdTimestamp - message.createdTimestamp
        }**ms. API Latency is **${Math.round(message.client.ws.ping)}**ms`
        );
    }
};