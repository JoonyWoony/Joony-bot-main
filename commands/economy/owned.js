const plants = require('../../imported values/plants')
let Discord = require('discord.js');
const mysql = require('mysql2/promise');
let presences = require('../../imported values/presence')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});
module.exports = {
    name: "inventory",
    aliases: ['inv','i'],
    category: "economy",
    description: "Rolling plants",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let user = message.mentions.members.first() || message.member
        let presence = presences[user.presence.status]['full']
        let money = await GetMoney(user.id)
        let plant = await GetPlant(user.id)
        if (!plant) {
            let embed = new Discord.MessageEmbed()
            .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
            .setTitle(`${user.user.username}'s Inventory  🧰`)
            .setDescription(`Plant(s) Owned\n**❌ No plants found.** This user did not claim plants.n\n\n👛 Balance\n<:Coin:935379171897643120> ${ShortCoins(money)}`)
            .addField(`User Statistics`, `User ID: \`${user.id}\`\n${presence}\nCreation Date: \`${user.user.createdAt}\`\n${user}`)
            .setColor('BLURPLE')
            .setFooter({text: `${user.user.tag} | ${message.guild.name}`, iconURL: user.displayAvatarURL()})
            return message.channel.send({embeds: [embed]})
        }
        if (user.id === '584996880748904459') {
            let embed = new Discord.MessageEmbed()
            .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
            .setTitle(`${user.user.username}'s Inventory  🧰`)
            .setDescription(`Plant(s) Owned\n${plants[plant]['name']} [${plants[plant]['info']}]\n${plants[plant]['rarity']}\n\n👛 Balance\n<:Coin:935379171897643120> ${ShortCoins(money)}  `)
            .addField(`User Statistics`, `User ID: \`${user.id}\`\nUser Presence: **${presence}**\nCreation Date: \`${user.user.createdAt}\`\n${user}`)
            .addField('Moderator Badge',`${presences['moderator']['full']}\n${presences['moderator']['info']}\n${presences['developer']['full']}\n${presences['developer']['info']}`)
            .setColor('BLURPLE')
            .setFooter({text: `${user.user.tag} | ${message.guild.name}`, iconURL: user.displayAvatarURL()})
            return message.channel.send({embeds: [embed]})
        }
        let embed = new Discord.MessageEmbed()
        .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
        .setTitle(`${user.user.username}'s Inventory  🧰`)
        .setDescription(`Plant(s) Owned\n${plants[plant]['name']} [${plants[plant]['info']}]\n${plants[plant]['rarity']}\n\n👛 Balance\n<:Coin:935379171897643120> ${ShortCoins(money)}  `)
        .addField(`User Statistics`, `User ID: \`${user.id}\`\nUser Presence: **${presence}**\nCreation Date: \`${user.user.createdAt}\`\n${user}`)
        .setColor('BLURPLE')
        .setFooter({text: `${user.user.tag} | ${message.guild.name}`, iconURL: user.displayAvatarURL()})
        return message.channel.send({embeds: [embed]})
    }
}


async function GetPlant(id) {
    let data = await (await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : 0
} 

async function GetMoney(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Money"] : undefined
}

function ShortCoins(Coins) {
    if (isNaN(Coins)) throw new Error('Coins cannot be a character')
    if (Coins <= 1000 ) return Math.round(Coins * 10) / 10
    if (Coins >= 1000000000) return (Math.round((Coins / 1000000000) * 10) / 10) + `B`
    if (Coins >= 1000000) return (Math.round((Coins / 1000000) * 10) / 10) + `M`
    if (Coins > 1000)  return (Math.round((Coins / 1000) * 10) / 10) + `K` 
  }