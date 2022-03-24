const Discord = require('discord.js')
const mysql = require('mysql2/promise');
require('dotenv').config();
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports =  {
    name: "reps",
    aliases: ['vouches','reputations'],
    category: "misc",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let member = message.mentions.members.first()
        let target = message.guild.members.cache.get(`${member.id}`)
        let targetreps = (await GetData(target.id)).Reputation
        let embed = new Discord.MessageEmbed()
        .setDescription(`${member} has ${targetreps} reputations.`)
        .setColor('#34eb83')
        message.channel.send({embeds: [embed]})
    }
}



async function GetData(id) {
    let endresult = {
        UserID: String(),
        Reputation: Number()
    }
    await (await connection).query(`SELECT * FROM Vouches WHERE UserID = "${id}"`).then(async (result) => {
        if (result[0][0] === undefined) return (endresult = {
            UserID: id,
            Reputation: undefined
        })

        endresult['Reputation'] = Number(result[0][0]['Reputations'])
    }).catch(error => {
        endresult = {
            UserID: id,
            Reputation: undefined
        }
    })
    return endresult
}