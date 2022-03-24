const Discord = require('discord.js')

module.exports = { 
    name: "howlove",
    description: 'Love percentage',
    category: "misc",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message) { 
        let member = message.mentions.members.first() || message.author
        let percentage = [Math.floor((Math.random() * 101))];
        message.channel.send(`Current Love Status: You love ${member} by **${percentage}%** ❤`)
    }
}