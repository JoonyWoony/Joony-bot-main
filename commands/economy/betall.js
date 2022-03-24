let Discord = require('discord.js');
const mysql = require('mysql2/promise');
const { updateBadgeInfo } = require('noblox.js');
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "betall",
    category: 'economy',
    cooldown: '100',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) { 
        let numb = Math.floor(Math.random() * 5)
        let multiplier = Math.floor(Math.random() * 4)
        let money = await GetMoney(message.author.id)
        let final = money*multiplier
        let ultrafinal = final + money
        message.channel.send(`You are about to bet all your money [${ShortCoins(money)}]. If you wish to continue, react with ✅`).then(msg => {
            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' && user.id === message.author.id;
            }
            const collector = msg.createReactionCollector({
                filter, 
                max: 1,
                time: 10000,
            })
            collector.on('collect', async (reaction) => {
                message.channel.send(`🎱 What number are you betting? Please type your number below this message. Your number can be from 0-5`).then(msg=> {
                    const msg_filter = (m) => m.author.id === message.author.id;
                    message.channel.awaitMessages({ filter: msg_filter, max: 1}).then((collected) => {
                        let collectet = collected.first()
                        if (collectet.content.includes(numb)) {
                            let embed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.username}'s Guess`})
                            .setDescription(`🤑💰 You won ${ShortCoins(money)} with the Multiplier of ${multiplier}\nYour balance is now <:Coin:935379171897643120> ${ShortCoins(ultrafinal)}`)
                            .addField(`Your guess`,`\`${numb}\` IDENTICAL`)
                            .addField("Bot's guess",`\`${numb}\` IDENTICAL`)
                            .setColor('GREEN')
                            message.channel.send({embeds: [embed]})
                            UpdateMoney(message.author.id, ultrafinal)
                        } else {
                            let embed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.username}'s Guess`})
                            .setDescription(`😭 You lost ${ShortCoins(money)}!`)
                            .addField(`Your guess`,`\`${collectet}\``)
                            .addField("Bot's guess",`\`${numb}\``)
                            .setColor('RED')
                            message.channel.send({embeds: [embed]})
                            UpdateMoney(message.author.id, 0)
                        }
                    })
                })
            })
        })
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