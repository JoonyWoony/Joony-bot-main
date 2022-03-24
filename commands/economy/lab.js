let Discord = require('discord.js')
const plants = require('../../imported values/plants')
const enchants = require('../../imported values/enchants')
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "labatory",
    aliases: ['lab','observatory'],
    category: "economy",
    description: "Labatory",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let diamonds = await GetDiamond(message.author.id)
        let embed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.username}'s Labatory 🧪`, iconURL: message.author.avatarURL({dynamic: true})})
        .setDescription(`${message.author}, Welcome to your labatory! Here you can experiment on enchantments and tables of plants!\nYou currently have 💎 ${diamonds} to spend!`)
        .addField('🟨 FORTUNE ENCHANTMENT',`Information: Gives an extra 20% of your earnings while harvesting.\nPurchase for 💎 ${enchants['fortune']['coin']}`)
        .addField('🟥 BIGHARVEST ENCHANTMENT',`Information: You can use \`.bigharvest\` command, where you can harvest a large amount of money x1-3, but has a longer cooldown.\nPurchase for 💎 ${enchants['bigharvest']['coin']}`)
        .addField('🟪 NUKE ENCHANTMENT',`Information: You can use \`.nuke\` command, It gives you coins from 1-500000 and 500-1000 diamonds\nPurchase for 💎 ${enchants['nuke']['coin']}`)
        .setColor('AQUA')
        message.channel.send({embeds: [embed]}).then(msg=> {
            let embed = new Discord.MessageEmbed()
            .setDescription("Hold up! Would you like to buy anything?\nIf you do not want to buy anything, react to ❌")
            .addField('Buy 🟨 FORTUNE',`${message.author}, to buy fortune, type \`fortune\``)
            .addField('Buy 🟥 Bigharvest',`${message.author}, to buy bigharvest, type \`bigharvest\``)
            .addField('Buy 🟪 Nuke',`${message.author}, to buy nuke, type \`nuke\``)
            .setColor('BLUE')
            message.channel.send({content: `${message.author}, React to ❌ to cancel operation.`, embeds: [embed]}).then(msg => {
                msg.react('❌')
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '❌' && user.id === message.author.id;
                }
                const collector = msg.createReactionCollector({
                    filter, 
                    max: 1,
                    time: 10000,
                })
                collector.on('collect', async(reaction) => {
                    message.author.send('The operation for BUY_LAB_ENCHANT was cancelled ❌')
                    return msg.delete()
                })
                const msg_filter = (m) => m.author.id === message.author.id;
                message.channel.awaitMessages({ filter: msg_filter, max: 1}).then((collected) => {
                    let content = collected.first()
                    let mssage = content.content
                    if (enchants[mssage]) {
                        if (diamonds < enchants[mssage]['coin']) {
                            return content.reply("You can't afford this mate!")
                        } else {
                            let coin = enchants[mssage]['coin']
                            let enchantmentss = enchants[mssage]['database']
                            let total = diamonds - coin
                            let embed = new Discord.MessageEmbed()
                            .setDescription(`${message.author.username}, You bought ${enchants[mssage]['name']} for <:Coin:935379171897643120> ${enchants[mssage]['coin']}!\nYou now have 💎 ${total}`)
                            .setColor('BLURPLE')
                            message.channel.send({embeds: [embed]})
                            UpdateDiamond(message.author.id, total)
                            UpdateEnchant(message.author.id, enchantmentss)

                            async function UpdateEnchant(id, Enchantment) {
                                let maindata = await GetEnchant(message.author.id, enchants[mssage]['database'])
                                if (maindata === undefined) {
                                    (await connection).query(`INSERT INTO Enchantment (UserID, ${enchants[mssage]['database']}) VALUES ("${id}", "${Enchantment}")`)
                                } else {
                                    (await connection).query(`UPDATE Enchantment SET ${enchants[mssage]['database']}= "${Enchantment}" WHERE UserID = "${id}"`)
                                }
                            }
                        }
                    } else {
                        return content.reply(`It seems like theres no enchant called ${mssage}`)
                    }
                })
            })
        })
    }
}
async function GetEnchant(id, enchant) {
    let data = await(await connection).query(`SELECT * FROM Enchantment WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0][enchant] : undefined
}


async function GetDiamond(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Diamond"] : undefined
}

async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}