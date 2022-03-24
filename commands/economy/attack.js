let Discord = require('discord.js')
const mysql = require('mysql2/promise');
let plant = require('../../imported values/shop_plant')
let slayers = require('../../imported values/slayer')
let ms = require('ms');
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "slay",
    category: "economy",
    description: "travel",
    cooldown: 3,
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let Cooldown = await GetTime(message.author.id)
        let slayer = await GetSlayer(message.author.id)
        let getactive = await GetActive(message.author.id)
        let getplant = await GetPlant(message.author.id)
        let gettype = await GetName(message.author.id)
        let money = await GetMoney(message.author.id)
        let diamond = await GetDiamond(message.author.id)
        let shard = plant[getplant]['shard']
        if (getactive === 'ACTIVE') { 
            let cooldownsecond = slayers[gettype]['time']
            if (Cooldown !== null && cooldownsecond - (Date.now() - Cooldown) > 0) {
              let format = ms(cooldownsecond - (Date.now() - Cooldown))
              let random = Math.floor((Math.random() * shard)+1);
              let slayerfinal = slayer - random
              UpdateSlayer(message.author.id, slayerfinal)
              let embed = new Discord.MessageEmbed()
              .setAuthor({ name: `Active ${slayers[gettype]['name']} QUEST ⚔ | ⌚ ONGOING`})
              .setDescription(`⚔ Faster Faster! You killed **${random}** ${slayers[gettype]['mobname']}, Come on, Joony bot thinks you can do it :D\n⚠ ${message.author}, You now have ${slayerfinal}/${slayers[gettype]['mob']} to go!`)
              .setColor('BLUE')
              .addField(`⌚ Time Remaining`,`${format} REMAINING!`)
              .setFooter({text: `Ongoing Slayer Quest Started by ${message.author.username}`})
              .setTimestamp()
              message.channel.send({embeds: [embed]}).then(msg=> {
                  if (slayerfinal < 0) { 
                      let rancoin = Math.floor((Math.random() * slayers[gettype]['reward'])+1);
                      let randiamond = Math.floor((Math.random() * slayers[gettype]['diamond'])+1);
                      let totalcoin = money - rancoin
                      let totaldiamond = diamond - randiamond
                      let embed = new Discord.MessageEmbed()
                      .setTitle(`✅ SLAYER ${slayers[gettype]['name']} COMPLETE!`)
                      .setDescription(`⛳ ${message.author} You sucessfully finished the slayer! You saved the plants..Now you may receive a reward!`)
                      .addField(`Collected Rewards`,`+ <:Coin:935379171897643120> ${rancoin}\n+ 💎 ${randiamond}\n`)
                      msg.edit({embeds: [embed]})
                      UpdateDiamond(message.author.id, totaldiamond)
                      UpdateMoney(message.author.id, totalcoin)
                      UpdateSlayerActive(message.author.id, 'NO') 
                      UpdateSlayer(message.author.id, 0)
                      UpdateSlayerTime(message.author.id, 0)

                  } 
              })
            } else { 
                let embed = new Discord.MessageEmbed()
                .setTitle(`❌ SLAYER QUEST | FAILED!`)
                .setDescription(`${message.author}, You ran out of TIME! The clock was ticking.. it was too late..`)
                .setColor('RED')
                message.channel.send({embeds: [embed]})
                UpdateSlayerActive(message.author.id, 'NO') 
                UpdateSlayer(message.author.id, 0)
                UpdateSlayerTime(message.author.id, 0)
            }
        } else { 
            let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `❌ An error has occured.. `})
            .setDescription(`You do not have a slayer started currently.`)
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
async function GetMoney(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Money"] : undefined
} 
async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}
async function UpdateMoney(id, coin) {
    (await connection).query(`UPDATE Plants SET Money="${coin}" WHERE UserID = "${id}"`)
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
async function GetDamage(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Damage"] : undefined
}
async function GetTime(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["SlayerTime"] : undefined
}
async function GetSlayer(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Slayer"] : undefined
}
async function GetName(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["SlayerName"] : undefined
}
async function GetActive(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Active"] : undefined
}
async function UpdateSlayer(id, slayer) {
    (await connection).query(`UPDATE Plants SET Slayer="${slayer}" WHERE UserID = "${id}"`)
    return true;
}
async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
}