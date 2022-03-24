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
    name: "bet",
    category: 'economy',
    aliases: ['cf'],
    cooldown: '1',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) { 
        let BotChose = Math.floor((Math.random() * 5) + 1)
        let MemberChose = Math.floor((Math.random() * 5) +1)
        let multiplier = Math.floor((Math.random() * 3) +1)
        let money = await GetMoney(message.author.id)
        let embed = new Discord.MessageEmbed()
        .setAuthor({name: "How much would you like to bet?", iconURL: message.author.displayAvatarURL({dynamic: true})})
        .setDescription(`💰 How much money are you betting? **Please type the bet amount below this message**. If you win, you will get x1-4 of the amount you bet.\nYou currently have **${ShortCoins(money)}** 😁`)
        .setColor('BLUE')
        message.channel.send({embeds: [embed]}).then(msg => {
            const msg_filter = (m) => m.author.id === message.author.id;
            message.channel.awaitMessages({ filter: msg_filter, max: 1}).then((collected) => { 
                let content = collected.first()
                if (Number.isNaN(Number(content.content))) {
                    return message.channel.send(`❌ You have not provided a number. Please execute the command again, and ensure that it is a number.`)
                } else {
                    if (content.content > 500000) {
                        return message.reply('👛 Sorry, You cannot bet more than 500K.')
                    }
                    if (content.content <= money) {
                        if (MemberChose === BotChose) {
                            let final = content.content*multiplier
                            let finalfinal = final + money
                            let embed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.username}'s BET | WON`})
                            .setDescription(`🤑💰 You won ${ShortCoins(content.content)} with the Multiplier of ${multiplier}\nYour balance is now <:Coin:935379171897643120> ${ShortCoins(finalfinal)}`)
                            .addField(`Your Coin`,`\`${MemberChose}\` IDENTICAL`)
                            .addField("Bot's Coin",`\`${BotChose}\` IDENTICAL`)
                            .setColor('GREEN')
                            message.channel.send({embeds: [embed]})
                            UpdateMoney(message.author.id, finalfinal)
                        } else {
                            let lost = money - content.content
                            let embed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.username}'s BET | LOST`})
                            .setDescription(`😭 You lost the BET! \nYour balance is now <:Coin:935379171897643120> ${ShortCoins(lost)}`)
                            .addField(`Your Coin`,`\`${MemberChose}\``)
                            .addField("Bot's Coin",`\`${BotChose}\``)
                            .setColor('RED')
                            message.channel.send({embeds: [embed]})
                            UpdateMoney(message.author.id, lost)
                        }   
                    } else {
                        let embed = new Discord.MessageEmbed()
                        .setAuthor({name: "You can't afford this!",iconURL: message.author.displayAvatarURL({dynamic: true})})
                        .setDescription(`Yo.. It seems like you don't have enough, You betted ${content.content} but your balance is ${money}\nGo gamble and get some more coins 🤑`)
                        .setColor('BLUE')
                        message.channel.send({embeds: [embed]})
                    }
                }
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