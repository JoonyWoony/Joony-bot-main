const { Interaction } = require('discord.js')
const Discord = require('discord.js')

module.exports = {
    name: "help",
    category: "misc",               
    description: "all help info",
    async execute(message) { 
        let embed = new Discord.MessageEmbed()
        .setAuthor({name: `📪 Need Help? Here is the Command List!`})
        .setDescription('use `.help` followed by the command you need help with, to get additional information. Example: `.help ban` [COMING SOON]\n**This bot may not function correctly as it was just created.**')
        .addField('🛶 MISC','`HELP` | `REP` | `REPS`')
        .addField('💭 OTHER/FUN','`HOWLOVE` | `8B` | `PING` | `POLL` | `KISS` | `HUG` | `TENOR`')
        .addField('🎟 ADMINISTRATOR','`TIMEOUT` | `BAN` | `UNBAN/PARDON` | `EVAL` | `RELOAD` ')
        .addField('👛 Economy','`PLANT` | `INVENTORY/I` | `BAL` | `HARVEST` | `BETALL` | `BET` | `TRAVEL` | `LAB` | `FF` | `BIG` | `GIVEMONEY` | `GIVEPLANT` | `DOCS`')
        .setTitle('Prefix - `.`')
        .setColor('BLURPLE')
        .setTimestamp()
        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setLabel('Support Server')
                .setStyle('LINK')
                .setURL('https://discord.gg/g7xpVcAESq'),
            new Discord.MessageButton()
                .setLabel('Add to Server')
                .setStyle('LINK')
                .setURL('https://discord.com/oauth2/authorize?client_id=930328042017005658&scope=bot&permissions=8')
        )
        message.channel.send({components: [row], embeds: [embed]})
    }
}