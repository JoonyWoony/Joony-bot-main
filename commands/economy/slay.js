let Discord = require('discord.js')
const mysql = require('mysql2/promise');
let plant = require('../../imported values/shop_plant')
let slayer = require('../../imported values/slayer')
let ms = require('ms');
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "slayer",
    category: "economy",
    description: "travel",
    cooldown: 3,
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let shop = await GetPlant(message.author.id)
        let damage = await GetDamage(message.author.id)
        let slayerstart = await GetSlayer(message.author.id)
        let active = await GetActive(message.author.id)
        let diamond =  await GetDiamond(message.author.id)
        if (plant[shop]) { 
            let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `Slayer QUEST | Season 1 ⚔`})
            .setDescription(`🏹🛡 Welcome...to SLAYERS! Do you feel like you can challenge the enemies? Are you ready for the fight?\n🎫 Challenge yourself with varieties of Insects and Creatures, and save plants from being infected! Will you be the hero...or the defeater?`)
            .addField(`Current Statistics`,`⚠ ${message.author.username}, ATTENTION! You can currently kill **1-${plant[shop]['shard']}** 👻👽 creatures at a time!\nYou will do 💪 **${damage}** as **ATTACK DAMAGE** to the Ultimate Boss of the slayer selected (PER HIT)`)
            .addField(`⁉ START QUEST`,`Select one slayer quest below to start the quest. **ONLY PRESS IF YOU WISH TO START THE SLAYER**`)
            .setColor('BLURPLE')
            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                .setCustomId('scorpian')
                .setLabel('Scorpian Slayer')
                .setEmoji('🦂')
                .setStyle('SUCCESS')
              )
            message.channel.send({embeds: [embed], components: [row]}).then(msg=> {
                const collector = message.channel.createMessageComponentCollector({
                  max: 1,
                  time: 60000,
                })
                collector.on('collect', async collect=> {
                    if (collect.customId === 'scorpian') { 
                        if (active === 'ACTIVE') {
                            return msg.edit({content: 'Cannot start quest while active', components: []})
                        } else {
                            let id = collect.customId
                            let purchase = slayer[id]['cost']
                            if (diamond > purchase) { 
                                let slayers = slayer[id]['name']
                                let embed = new Discord.MessageEmbed()
                                .setTitle(`Slayer QUEST ⚔ | ${slayers}`)
                                .setDescription(`You have started ${slayers} QUEST for ${purchase} GEMS! ! Slayer Information: [${slayers}] ${slayer[id]['info']}`)
                                .addField('Slayer Stats',`♦ Slayer Difficulty: **${slayer[id]['difficulty']}**\n🔄 Slayer Mob Count: **${slayer[id]['mob']}**\n⌚ Time to complete: ${slayer[id]['time']}`)
                                .addField('Slayer Quest Started ✅',`♦ QUEST: You have 💀 0/${slayer[id]['mob']} to kill.`)
                                .setColor('GREEN')
                                msg.edit({embeds: [embed], components: []})
                                UpdateSlayer(message.author.id, slayer[id]['mob'], slayer[id]['db'])
                                UpdateSlayerActive(message.author.id, 'ACTIVE')
                                UpdateSlayerTime(message.author.id, Date.now())  
                                UpdateDiamond(message.author.id, diamond-purchase) 
                            } else {
                                message.channel.send('You cannot afford this! ‼😑')
                            }
                        }
                    }
                })
            })
        } else {
            let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `❌ An error has occured.. `})
            .setDescription(`You do not own a plant that can start a slayer! Go buy one at \`.shop\`!`)
            .setColor("AQUA")
            .setFooter({ text: `${message.guild.name}`})
            .setTimestamp()
            message.channel.send({embeds: [embed]})
        }
    }
}
async function GetDiamond(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Diamond"] : undefined
}
async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}
async function GetActive(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Active"] : undefined
}
async function GetDamage(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Damage"] : undefined
}
async function GetSlayer(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Slayer"] : undefined
}
async function UpdateSlayer(id, slayer, name) {
    (await connection).query(`UPDATE Plants SET Slayer="${slayer}",SlayerName="${name}" WHERE UserID = "${id}"`)
    return true;
}
async function UpdateSlayerActive(id, slayer) {
    (await connection).query(`UPDATE Plants SET Active="${slayer}" WHERE UserID = "${id}"`)
    return true;
}
async function UpdateSlayerTime(id, slayer) {
    (await connection).query(`UPDATE Plants SET SlayerTime="${slayer}" WHERE UserID = "${id}"`)
    return true;
}
async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
}