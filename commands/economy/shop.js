let Discord = require('discord.js')
const mysql = require('mysql2/promise');
let shopplant = require('../../imported values/shop_plant')
let ms = require('ms')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "shop",
    category: "economy",
    description: "travel",
    cooldown: 3,
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let diamond = await GetDiamond(message.author.id)
        let embed = new Discord.MessageEmbed()
        .setAuthor({name: `Welcome to the Shop, ${message.author.username}! 🛒`, iconURL: message.member.displayAvatarURL({dynamic: true})})
        .setDescription(`Select a Plant that you wish to buy below in the drop down menu.\nYou currently have 💎 ${ShortCoins(diamond)}, spend those Gems before you miss em!`)
        .addField('Additional Information',`You can look at plant information by simply doing \`.docs <PLANT_NAME>\`!\nTry it out ${message.author.username}!`)
        .setColor('AQUA')
        let row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId('SelectMenu')
            .setPlaceholder('Nothing is currently selected.')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions([
                {
                    label: 'Pitcher Plant',
                    description: `Buy ${shopplant['pitcher']['name']} for ${shopplant['pitcher']['purchase']} 💎`,
                    value: 'pitcher',
                    emoji: '<:unique:950673513340084244>'
                },
                {
                    label: 'Venus Flytrap Plant',
                    description: `Buy ${shopplant['venusflytrap']['name']} for ${shopplant['venusflytrap']['purchase']} 💎`,
                    value: 'venusflytrap',
                    emoji: '<:unique:950673513340084244>'
                },
                {
                    label: 'Sundew Carnivorus Plant',
                    description: `Buy ${shopplant['sundew']['name']} for ${shopplant['sundew']['purchase']} 💎`,
                    value: 'sundew',
                    emoji: '<:unique:950673513340084244>'
                },
                {
                    label: 'Lychee Fruit Plant',
                    description: `Buy ${shopplant['lychee']['name']} for ${shopplant['lychee']['purchase']} 💎`,
                    value: 'lychee',
                    emoji: '<:unique:950673513340084244>'
                },
            ])
        )

        
        message.channel.send({embeds: [embed], components: [row]}).then(msg=> {
            const filter = i => i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000,
                componentType: 'SELECT_MENU',
            })
            collector.on('collect', async collect => {
                //name info rarity picture purchase coin shard
                if (collect.customId === 'SelectMenu') {
                    if (collect.values.includes('pitcher')) {
                        let value = collect.values
                        let purchase = [shopplant[value]['purchase']]
                        if (purchase >= diamond) {
                            message.channel.send('u cant afford this')
                        } else {
                            let name = shopplant[value]['name']
                            let rarity = shopplant[value]['rarity']
                            let picture = shopplant[value]['picture']
                            let final = diamond - purchase
                            let embed = new Discord.MessageEmbed()
                            .setTitle('Shop Confirmation ❗')
                            .setAuthor({ name: `Confirming ${message.author.username}'s Selection of ${name}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setDescription(`Are you sure that you want to buy ${name} for ${purchase} 💎 ?\nYour balance will be 💎 ${final} after this.`)
                            .addField(`${name} Statistics`,`Plant Rarity: ${rarity}\nProduces <:Coin:935379171897643120> ${shopplant[value]['coin']}\nProduces ${shopplant[value]['shard']} Shards [COMING SOON`)
                            .setColor('RED')
                            msg.edit({components: [], embeds: [embed]}).then(msgg=> {
                                msgg.react('✅')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                                }
                                const collector = msgg.createReactionCollector({
                                    filter, 
                                    max: 1,
                                    time: 10000,
                                })
                                collector.on('collect', async (reaction) => {
                                    let embed = new Discord.MessageEmbed()
                                    .setAuthor({name: `Purchase Confirmed [${name}] ✅`})
                                    .setDescription(`${message.author.username}, you now own ${name}! Your balance has been updated to ${final}. Congratulations on your new plant!\ndo, \`.i\` to check your plant!`)
                                    .addField('Plant Rarity',`${rarity}`)
                                    .setImage(`${picture}`)
                                    .setColor('GREEN')
                                    msgg.edit({content: 'Purchase confirmed ✅', embeds: [embed]})
                                    UpdateDiamond(message.author.id, final)
                                    AddPlant(message.author.id, value)
                                })
                            })
                        }
                    }
                    if (collect.values.includes('lychee')) {
                        let value = collect.values
                        let purchase = [shopplant[value]['purchase']]
                        if (purchase >= diamond) {
                            message.channel.send('u cant afford this')
                        } else {
                            let name = shopplant[value]['name']
                            let rarity = shopplant[value]['rarity']
                            let picture = shopplant[value]['picture']
                            let final = diamond - purchase
                            let embed = new Discord.MessageEmbed()
                            .setTitle('Shop Confirmation ❗')
                            .setAuthor({ name: `Confirming ${message.author.username}'s Selection of ${name}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setDescription(`Are you sure that you want to buy ${name} for ${purchase} 💎 ?\nYour balance will be 💎 ${final} after this.`)
                            .addField(`${name} Statistics`,`Plant Rarity: ${rarity}\nProduces <:Coin:935379171897643120> ${shopplant[value]['coin']}\nProduces ${shopplant[value]['shard']} Shards [COMING SOON`)
                            .setColor('RED')
                            msg.edit({components: [], embeds: [embed]}).then(msgg=> {
                                msgg.react('✅')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                                }
                                const collector = msgg.createReactionCollector({
                                    filter, 
                                    max: 1,
                                    time: 10000,
                                })
                                collector.on('collect', async (reaction) => {
                                    let embed = new Discord.MessageEmbed()
                                    .setAuthor({name: `Purchase Confirmed [${name}] ✅`})
                                    .setDescription(`${message.author.username}, you now own ${name}! Your balance has been updated to ${final}. Congratulations on your new plant!\ndo, \`.i\` to check your plant!`)
                                    .addField('Plant Rarity',`${rarity}`)
                                    .setImage(`${picture}`)
                                    .setColor('GREEN')
                                    msgg.edit({content: 'Purchase confirmed ✅', embeds: [embed]})
                                    UpdateDiamond(message.author.id, final)
                                    AddPlant(message.author.id, value)
                                })
                            })
                        }
                    }
                    if (collect.values.includes('sundew')) {
                        let value = collect.values
                        let purchase = [shopplant[value]['purchase']]
                        if (purchase >= diamond) {
                            message.channel.send('u cant afford this')
                        } else {
                            let name = shopplant[value]['name']
                            let rarity = shopplant[value]['rarity']
                            let picture = shopplant[value]['picture']
                            let final = diamond - purchase
                            let embed = new Discord.MessageEmbed()
                            .setTitle('Shop Confirmation ❗')
                            .setAuthor({ name: `Confirming ${message.author.username}'s Selection of ${name}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setDescription(`Are you sure that you want to buy ${name} for ${purchase} 💎 ?\nYour balance will be 💎 ${final} after this.`)
                            .addField(`${name} Statistics`,`Plant Rarity: ${rarity}\nProduces <:Coin:935379171897643120> ${shopplant[value]['coin']}\nProduces ${shopplant[value]['shard']} Shards [COMING SOON`)
                            .setColor('RED')
                            msg.edit({components: [], embeds: [embed]}).then(msgg=> {
                                msgg.react('✅')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                                }
                                const collector = msgg.createReactionCollector({
                                    filter, 
                                    max: 1,
                                    time: 10000,
                                })
                                collector.on('collect', async (reaction) => {
                                    let embed = new Discord.MessageEmbed()
                                    .setAuthor({name: `Purchase Confirmed [${name}] ✅`})
                                    .setDescription(`${message.author.username}, you now own ${name}! Your balance has been updated to ${final}. Congratulations on your new plant!\ndo, \`.i\` to check your plant!`)
                                    .addField('Plant Rarity',`${rarity}`)
                                    .setImage(`${picture}`)
                                    .setColor('GREEN')
                                    msgg.edit({content: 'Purchase confirmed ✅', embeds: [embed]})
                                    UpdateDiamond(message.author.id, final)
                                    AddPlant(message.author.id, value)
                                })
                            })
                        }
                    }
                    if (collect.values.includes('venusflytrap')) {
                        let value = collect.values
                        let purchase = [shopplant[value]['purchase']]
                        if (purchase >= diamond) {
                            message.channel.send('u cant afford this')
                        } else {
                            let name = shopplant[value]['name']
                            let rarity = shopplant[value]['rarity']
                            let picture = shopplant[value]['picture']
                            let final = diamond - purchase
                            let embed = new Discord.MessageEmbed()
                            .setTitle('Shop Confirmation ❗')
                            .setAuthor({ name: `Confirming ${message.author.username}'s Selection of ${name}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                            .setDescription(`Are you sure that you want to buy ${name} for ${purchase} 💎 ?\nYour balance will be 💎 ${final} after this.`)
                            .addField(`${name} Statistics`,`Plant Rarity: ${rarity}\nProduces <:Coin:935379171897643120> ${shopplant[value]['coin']}\nProduces ${shopplant[value]['shard']} Shards [COMING SOON`)
                            .setColor('RED')
                            msg.edit({components: [], embeds: [embed]}).then(msgg=> {
                                msgg.react('✅')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                                }
                                const collector = msgg.createReactionCollector({
                                    filter, 
                                    max: 1,
                                    time: 10000,
                                })
                                collector.on('collect', async (reaction) => {
                                    let embed = new Discord.MessageEmbed()
                                    .setAuthor({name: `Purchase Confirmed [${name}] ✅`})
                                    .setDescription(`${message.author.username}, you now own ${name}! Your balance has been updated to ${final}. Congratulations on your new plant!\ndo, \`.i\` to check your plant!`)
                                    .addField('Plant Rarity',`${rarity}`)
                                    .setImage(`${picture}`)
                                    .setColor('GREEN')
                                    msgg.edit({content: 'Purchase confirmed ✅', embeds: [embed]})
                                    UpdateDiamond(message.author.id, final)
                                    AddPlant(message.author.id, value)
                                })
                            })
                        }
                    }
                }
            })
        })
    }
}
async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
} 
async function AddPlant(id, plant) {
    let lol = await GetPlant(id)
    if (lol === undefined) {
        (await connection).query(`INSERT INTO Plants (UserID, Plant) VALUES ("${id}", "${plant}")`)
    } else {
        (await connection).query(`UPDATE Plants SET Plant="${plant}" WHERE UserID="${id}"`)
    }
    return true;
}
function ShortCoins(Coins) {
    if (isNaN(Coins)) throw new Error('Coins cannot be a character')
    if (Coins <= 1000 ) return Math.round(Coins * 10) / 10
    if (Coins >= 1000000000) return (Math.round((Coins / 1000000000) * 10) / 10) + `B`
    if (Coins >= 1000000) return (Math.round((Coins / 1000000) * 10) / 10) + `M`
    if (Coins > 1000)  return (Math.round((Coins / 1000) * 10) / 10) + `K` 
  }

async function GetDiamond(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Diamond"] : undefined
}
async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}