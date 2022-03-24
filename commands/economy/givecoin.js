let Discord = require('discord.js')
const plants = require('../../imported values/plants')
const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "givemoney",
    category: "economy",
    description: "Rolling plants",
    cooldown: '10',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let xd = message.mentions.members.first()
        let money = await GetMoney(message.author.id)
        if (!xd) return message.reply(`❌ You haven't provided a user! Mention a user next time.`)
        if (money) {
            let embed = new Discord.MessageEmbed()
            .setAuthor({name: `You are giving coins to ${xd.user.username}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setDescription(`💰 How much money would you like to give to ${xd} ?\nType the amount you would like to give in chat.\nYou currently have **${ShortCoins(money)}** 😁`)
            .setColor('BLUE')
            message.channel.send({embeds: [embed]}).then(msg => {
                const msg_filter = (m) => m.author.id === message.author.id;
                message.channel.awaitMessages({ filter: msg_filter, max: 1}).then((collected) => {
                    let content = collected.first()
                    if (Number.isNaN(Number(content.content))) {
                        return message.channel.send(`❌ You have not provided a number. Please execute the command again, and ensure that it is a number.`)
                    } else {
                        if (content.content > 50000000) {
                            return message.reply('👛 Sorry, You cannot give more than 50M.')
                        } else {
                            if (money < content.content) {
                                return message.channel.send('Hey! you do not have enough for this!')
                            } else {
                                let embed = new Discord.MessageEmbed()
                                .setAuthor({name: `${message.author.username}'s Transaction 💳 | AWAITING`})
                                .setDescription(`Coin Transaction is awaiting.\n⚠ If ${xd} already has a plant, it will be replaced ⚠`)
                                .addField('Trade Status',`${xd} has to react to this message with ✅ to CONFIRM\nEXPIRES in 10 Seconds`)
                                .addField('Trading',`${ShortCoins(content.content)} 💰`)
                                .setFooter({ text: `${xd.user.username}, react with ✅ to confirm the trade`})
                                .setColor('RED')
                                message.channel.send({embeds: [embed]}).then(msg => {
                                    msg.react('✅')
                                    const filter = (reaction, user) => {
                                        return reaction.emoji.name === '✅' && user.id === xd.id;
                                    }
                                    const collector = msg.createReactionCollector({
                                        filter, 
                                        max: 1,
                                        time: 10000,
                                    })
                                    collector.on('collect', async(reaction) => {
                                        let cilentmoney = await GetMoney(xd.id)
                                        let moneyy = content.content*0.99
                                        let updatemention = cilentmoney + moneyy
                                        let totalmoney = money - content.content
                                        let embed = new Discord.MessageEmbed()
                                        .setAuthor({name: `${message.author.username}'s Transaction 💳 | CONFIRMED`})
                                        .setDescription(`${xd}, ${message.author.username} gave you ${content.content}! ${xd.user.username} now has ${updatemention}!`)
                                        .addField('Trade Status',`CONFIRMED ✅`)
                                        .addField('Trading',`${content.content}`)
                                        .setColor('GREEN')
                                        message.channel.send({embeds: [embed]})
                                        UpdateMoney(xd.id, updatemention)
                                        UpdateMoney(message.author.id, totalmoney)
                                    })
                                })
                            }
                        }
                    }
                })
            })
        }
    }
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

  async function UpdateMoney(id, coin) {
    (await connection).query(`UPDATE Plants SET Money="${coin}" WHERE UserID = "${id}"`)
    return true;
}