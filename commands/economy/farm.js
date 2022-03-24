let Discord = require('discord.js');
const mysql = require('mysql2/promise');
const animals = require('../../imported values/animals')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "animal",
    category: 'economy',
    aliases: ['barn'],
    cooldown: '50',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let getmoney = await GetMoney(message.author.id)
        let diamond = await GetDiamond(message.author.id)
        var rarities = [{
            type: "cow",
            chance: 0
          }, {
            type: "chicken",
            chance: 1700
          }, {
            type: "duck",
            chance: 1700
          }, {
            type: "horse",
            chance: 1700
          }, {
            type: "fly",
            chance: 1700
          }, {
            type: "sheep",
            chance: 1700
          }, {
            type: "pig",
            chance: 1700
            //common
          }, {
            type: "rabbit",
            chance: 650
          }, {
            type: "beaver",
            chance: 650
          }, {
            type: "swan",
            chance: 650
          }, {
            type: "ladybug",
            chance: 650,
          }, {
            type: "dog",
            chance: 650,
            //uncommon
          }, {
            type: "monkey",
            chance: 300,
          }, {
            type: "turtle",
            chance: 300,
          }, {
            type: "dove",
            chance: 300,
          }, {
            type: "cat",
            chance: 300,
          }, {
            type: "fish",
            chance: 300,
            //rare
          }, {
            type: "elephant",
            chance: 100,
          }, {
            type: "whale",
            chance: 100,
          }, {
            type: "tiger",
            chance: 100,
          }, {
            type: "lion",
            chance: 100,
            //epic
          }, {
            type: "hedgehog",
            chance: 20
          }, {
            type: "owl",
            chance: 20
         }, {
            type: "bison",
            chance: 20
            //legendary
          }, {
            type: "dragon",
            chance: 1
          }, {
            type: "mammoth",
            chance: 1
          }];
          function pickRandom() {
            let randomdialogue = [`🧪 You did a few experiments...You spawned in a new Animal??`,`👑 Animal master..For now! Good lucky!`,`🐍 Slither..the forest.! And conquerrr...`,`💎 Insect or animal..Which one? I don't know..You might?`,`Bro...you robbed the animal from the zoo 😂`,`🥼 Animal Experience! That was nice!`,`🐣 The animal kingdom awaits you..`,`🌴 Zoologist..?? Empire???`,`📋 Master Animal Care..Hmm..`,`🐉 Rawrrrr! That's a good animal..I think!`,`Maybe this can brighten my day! 😊`,`☘ Lucky guy..Only today?`,`👍 The Best Animal Farmer.`]
            let random = randomdialogue[Math.floor((Math.random() * randomdialogue.length))];
            // Calculate chances for common
            var filler = 17000 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
          
            if (filler <= 0) {
              console.log("chances sum is higher than 100!");
              return;
            }
          
            // Create an array of 100 elements, based on the chances field
            var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
          
            // Pick one
            var pIndex = Math.floor(Math.random() * 17000);
            var rarity = rarities[probability[pIndex]];
            let answer = rarity.type
            let animal = animals[answer]['name']
            let animalvalue = animals[answer]['value']
            let animalrarity = animals[answer]['rarity']
            let number = Math.floor((Math.random() * 6) +1)
            let numbdiamond = Math.floor((Math.random() * 10) +1)
            let totaldiamond = diamond + numbdiamond
            let animalmoney = animalvalue * number
            let totalmoney = getmoney + animalmoney
            let embed = new Discord.MessageEmbed()
            .setTitle(`${random}`)
            .setDescription(`🤑 ${message.author.username} 🌍 You found **${number}** ${animal}, and 💎 ${numbdiamond}!\n👛 You now have <:Coin:935379171897643120> ${ShortCoins(totalmoney)} & 💎 ${ShortCoins(totaldiamond)}\n${animal} is ${animalrarity}, is it a rare drop?`)
            .setColor('BLUE')
            .setFooter({ text: `${message.author.username} might be 🤑 Rich becuz he just got some animals! Woo hoo!`})
            .setTimestamp()
            message.channel.send({embeds: [embed]})
            UpdateMoney(message.author.id, totalmoney)
            UpdateDiamond(message.author.id, totaldiamond)
          }
        let verification = Math.floor(Math.random() * 30)
        let GetBypass = await GetUserID(message.author.id)
        if (verification > 29) {
            if (GetBypass === 'Bypass') {
                return message.reply('You bypassed the captcha, as you were whitelisted ✅')
            } else {
                let number1 = Math.floor(Math.random() * 20)
                let number2 = Math.floor(Math.random() * 20)
                let answer = number1 + number2 
                message.channel.send(`${message.author}, [ANTI-MACRO-CHECK] This is a random check to prevent macroing.\n**What is \`${number1}\` + \`${number2}\` =**\nType your answer in this format: EXAMPLE: \`.verify 13\``).then(msg => {
                    const msg_filter = (m) => m.author.id === message.author.id;
                    message.channel.awaitMessages({ filter: msg_filter, max: 1}).then((collected) => {
                        let noice = collected.first()
                        if (noice.content.includes(answer)) {
                            return msg.edit('✅ Verification approved. Have fun playing!')
                        } else {
                            AddBlacklist(message.author.id, 'Blacklisted')
                            return message.channel.send('❌ You have failed the verification test. **You have been blacklisted permanately.**\nIf you think the blacklist was unfair or mistaken, and would love to provide context, you can appeal.\nAppeal Server link: https://discord.gg/FUN6xD2PZh')
                        }
                    })
                })
            }
        } else {
            let final = getmoney - 3000
            if (getmoney <= final) {
                return message.reply(`Seems like you cannot afford this! Grind some more coins to use this command! It costs 5000 coins.`)
            } else {
                UpdateMoney(message.author.id, final)
                pickRandom()
            }
        }
    }
}
async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}

async function AddBlacklist(id, Answer) {
    (await connection).query(`INSERT INTO Blacklist (UserID, Answer) VALUES ("${id}", "${Answer}")`)
return true;
}
async function UpdateMoney(id, coin) {
    (await connection).query(`UPDATE Plants SET Money="${coin}" WHERE UserID = "${id}"`)
    return true;
}

async function GetUserID(id) {
    let data = await(await connection).query(`SELECT * FROM Blacklist WHERE UserID = "${id}"`)
    
    return data[0][0] ? data[0][0]["Bypass"] : undefined
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