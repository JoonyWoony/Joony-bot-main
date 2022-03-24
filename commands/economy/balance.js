let Discord = require('discord.js')
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "balance",
    aliases: ['bal'],
    category: 'economy',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message) {
        let user = message.mentions.members.first() || message.member
        let CacheMoney = await GetMoney(user.id)
        let CacheDiamond = await GetDiamond(user.id)
        let FormatMoney = ShortCoins(CacheMoney)
        const Embed = new Discord.MessageEmbed()
        .setAuthor({name: `${user.user.username}'s Balance`, iconURL: user.displayAvatarURL({dynamic: true})})
        .setDescription(`👛 Balance: ${FormatMoney} [Unformatted: ${CacheMoney}]\n💎 Diamonds: ${CacheDiamond} [BETA: This is in DEVELOPMENT]`)
        .setFooter({text: `🤑 Rich`})
        .setTimestamp()
        .setColor('NOT_QUITE_BLACK')
        return message.channel.send({embeds: [Embed]})
    }        
}
async function GetDiamond(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Diamond"] : undefined
}
function ShortCoins(Coins) {
    if (isNaN(Coins)) throw new Error('Coins cannot be a character')
    if (Coins <= 1000 ) return Math.round(Coins * 10) / 10
    if (Coins >= 1000000000) return (Math.round((Coins / 1000000000) * 10) / 10) + `B`
    if (Coins >= 1000000) return (Math.round((Coins / 1000000) * 10) / 10) + `M`
    if (Coins > 1000)  return (Math.round((Coins / 1000) * 10) / 10) + `K` 
  }

async function GetMoney(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Money"] : undefined
}   