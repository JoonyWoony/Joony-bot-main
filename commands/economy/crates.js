let Discord = require('discord.js');
const mysql = require('mysql2/promise');
let crates = require('../../imported values/crates')
let ms = require('ms')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "crates",
    category: 'economy',
    aliases: ['box'],
    cooldown: '1',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) { 
        let money = await GetMoney(message.author.id)
        let diamond = await GetDiamond(message.author.id)
        var rarities = [{
            type: "common",
            chance: 0
          }, {
            type: "uncommon",
            chance: 2000
          }, {
            type: "rare",
            chance: 2000
          }, {
            type: "epic",
            chance: 1000
          }, {
            type: "legendary",
            chance: 20
          }, {
            type: "mythical",
            chance: 3
          }, {
            type: "chromatic",
            chance: 1
          }];
          
          function pickRandom() {
            // Calculate chances for common
            var filler = 7000 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
          
            if (filler <= 0) {
              console.log("chances sum is higher than 100!");
              return;
            }
          
            // Create an array of 100 elements, based on the chances field
            var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
          
            // Pick one
            var pIndex = Math.floor(Math.random() * 7000);
            var rarity = rarities[probability[pIndex]];
            let answer = rarity.type
            let crate = crates[answer]['name']
            let maxdiamond = crates[answer]['maxdiamond']
            let basediamond = crates[answer]['basediamond']
            let maxcoin = crates[answer]['maxcoin']
            let basecoin = crates[answer]['basecoin']
            let coin = Math.floor(Math.random() * maxcoin);
            let diamondrandom = Math.floor(Math.random() * maxdiamond);
            let moneytotal = money + coin + basecoin 
            let withoutdepositmoney = basecoin + coin
            let diamondtotal = diamond + basediamond + diamondrandom
            let withoutdepositdiamond = basediamond + diamondrandom
            //${ShortCoins(moneytotal)}\n${ShortCoins(diamondtotal)}
            let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `📦 You searched for a Crate!`, iconURL: message.guild.iconURL()})
            .setDescription(`${message.author}, You found **${crate}**! Press the Button below to open it up!`)
            .addField('Max Diamond Obtainable',`💎 ${ShortCoins(maxdiamond)} + 💎 BaseDiamond: ${ShortCoins(basediamond)}`)
            .addField('Max Coin Obtainable',`<:Coin:935379171897643120> ${ShortCoins(maxcoin)} + <:Coin:935379171897643120> BaseCoin: ${ShortCoins(basecoin)}`)
            .setColor('GREEN')
            const row = new Discord.MessageActionRow().addComponents(
              new Discord.MessageButton()
              .setCustomId('OpenCrate')
              .setLabel('Open Crate')
              .setEmoji('📦')
              .setStyle('SUCCESS')
            )
            message.channel.send({embeds: [embed], components: [row]}).then(msg=> {
              const filter = i => i.customId === 'OpenCrate' && i.user.id === message.author.id;
              const collector = message.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 60000,
              })
              collector.on('collect', async collect => {
                if (collect.customId === 'OpenCrate') {
                  let embed = new Discord.MessageEmbed()
                  .setAuthor({name: `Here are your earnings!`, iconURL: message.member.displayAvatarURL({dynamic: true})})
                  .setDescription(`You now have 👛 ${ShortCoins(moneytotal)} & 💎 ${diamondtotal}!`)
                  .addField(`Diamonds Obtained`,`💎 ${withoutdepositdiamond}`)
                  .addField(`Coins Obtained`,`👛 ${ShortCoins(withoutdepositmoney)}`)
                  .setFooter({text: `Claimed ${answer} crate | ${message.guild.name}`})
                  .setTimestamp()
                  .setColor('YELLOW')
                  msg.edit({ content: `${message.author}, you opened **${crate}**!`,embeds: [embed],components: []})
                  UpdateDiamond(message.author.id, diamondtotal)
                  UpdateMoney(message.author.id, moneytotal)
                  UpdateCooldown(message.author.id, Date.now())
                }
              })

            })
          }
        let cooldownsecond = 21600000
        let Cooldown = await GetCooldown(message.author.id)
        if (Cooldown !== null && cooldownsecond - (Date.now() - Cooldown) > 0) {
          let format = ms(cooldownsecond - (Date.now() - Cooldown))
          message.channel.send(` ${message.author}, Hey there! It seems like you have ${format} until you can find crates again! Get more coins in the meantime 😇 HEHE!`)
        } else {
          pickRandom()
        }
    }
}
async function UpdateCooldown(id, Cooldown) {
  let maindata = await GetCooldown(id)
  if (maindata === undefined) {
      (await connection).query(`INSERT INTO Cooldown (UserID, Crate) VALUES ("${id}", "${Cooldown}")`)
  } else {
      (await connection).query(`UPDATE Cooldown SET Crate= "${Cooldown}" WHERE UserID = "${id}"`)
  }
}
async function GetCooldown(id) {
  let data = await(await connection).query(`SELECT * FROM Cooldown WHERE UserID = "${id}"`)

  return data[0][0] ? data[0][0]["Crate"] : undefined
}
async function GetCrate(id) {
    let data = await(await connection).query(`SELECT * FROM Crate WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Crate"] : undefined
}

async function AddCrate(id, count) {
    let d = await GetCrate(id)
    if (d === undefined) {
        (await connection).query(`INSERT INTO Crate (UserID, Crate) VALUES ("${id}", "${count}")`)
    }else {
        (await connection).query(`UPDATE Crate SET Crate = "${count}" WHERE UserID = "${id}"`)
    }
    return true;
}


async function UpdateMoney(id, coin) {
    (await connection).query(`UPDATE Plants SET Money="${coin}" WHERE UserID = "${id}"`)
    return true;
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

async function GetDiamond(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Diamond"] : undefined
}

async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}