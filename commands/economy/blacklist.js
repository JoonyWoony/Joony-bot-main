
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
    name: "blacklist",
    aliases: ['moderate','bl','botban'],
    category: 'economy',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {

        let user = message.author
        let bluser = message.mentions.members.first()
        let getid = await GetBlacklist(user.id)
        if (getid === 'Yes') {
            if (bluser.id === message.author.id) {
                return;
            }
            if (args.length >= 2) {
                args.shift();
                reason = args.join(' ');
            } else reason = 'No reason provided'
            let blacklistembed = new Discord.MessageEmbed()
            .setTitle('Blacklist Finished ✅')
            .setDescription(`<:BotModerator:947757180382232587> ${message.author} Actions recorded. ${bluser} has been alerted!`)
            .setColor('BLURPLE')
            message.channel.send({embeds: [blacklistembed]})
            bluser.send(`**You have been permanately blacklisted by a Bot Moderator for: ${reason}**\nIf you think the blacklist was unfair, and would love to provide context, you can appeal.\nAppeal Server link: https://discord.gg/FUN6xD2PZh`)
            AddBlacklist(bluser.id, 'Blacklisted')
        } else {
            return;
        }
        }
    }


async function AddBlacklist(id, Answer) {
        (await connection).query(`INSERT INTO Blacklist (UserID, Answer) VALUES ("${id}", "${Answer}")`)
    return true;
}

async function GetBlacklist(id) {
    let data = await(await connection).query(`SELECT * FROM BotModerator WHERE UserID = "${id}"`)
  
    return data[0][0] ? data[0][0]["Moderator"] : undefined
  } 
