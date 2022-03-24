let Discord = require('discord.js');
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "botmod",
    aliases: ['m'],
    category: 'economy',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        if (message.author.id === '584996880748904459') {
            let user = message.mentions.members.first()
            if (args.length >= 2) {
                args.shift();
            } else reason = args.join(' ');
            let Embed = new Discord.MessageEmbed()
            .setAuthor({name: '[MOD] User Promoted', iconURL: user.displayAvatarURL({dynamic: true})})
            .setDescription(`<:BotModerator:947757180382232587> ${user}, You now have access to all moderation commands. For questions & Information, please ask the developer.`)
            .setColor('BLURPLE')
            message.channel.send({embeds: [Embed]})
            await AddMod(user.id, 'Yes')
        }
    }
}


async function AddMod(id, Answer) {
    (await connection).query(`INSERT INTO BotModerator (UserID, Moderator) VALUES ("${id}", "${Answer}")`)
return true;
}