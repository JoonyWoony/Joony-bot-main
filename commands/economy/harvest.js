let Discord = require('discord.js')
const plants = require('../../imported values/plants')
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "harvest",
    aliases: ['farm'],
    category: "economy",
    description: "Rolling plants",
    cooldown: '25',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let Plant = await GetPlant(message.member.id)
        let verification = Math.floor((Math.random() * 30)+ 1)
        let GetBypass = await GetUserID(message.author.id)
        if (verification > 29) {
            if (GetBypass === 'Bypass') {
                return message.reply('You bypassed the captcha, as you were whitelisted ✅')
            } else {
                let number1 = Math.floor(Math.random() * 20)
                let number2 = Math.floor(Math.random() * 20)
                let answer = number1 + number2 
                message.channel.send(`[ANTI-MACRO-CHECK] This is a random check to prevent macroing.\n**What is \`${number1}\` + \`${number2}\` =**\nType your answer in this format: EXAMPLE: \`.verify 13\``).then(msg => {
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
            if (Plant) {
                let coin = plants[Plant]['coin']
                let bonus = Math.floor(Math.random() * coin);
                let get = await GetMoney(message.author.id)
                let dbversion = coin + get + bonus
                let coins = ShortCoins(dbversion)
                let withoutbonus = coin
                let randomdialogue = [`Mhm..Another day of harvesting 😋`,`👍 What a great harvest.. You get all of it..`,'🤑 A huge bucket of fruits! Today was a great harvest..',`😊 Just a regular harvest..with ${plants[Plant]['name']}`,`🎉 I knew that ${plants[Plant]['name']} was a great choice!`,`Oh my! 🍍🍍🍎 Fruit Party 🥳🥳`,`👩‍🌾 Are you the best.. of the best??`,`🤑 Another day of farming! Here we go!`,`🦗 Clearing the infestation?`]
                let answer = randomdialogue[Math.floor((Math.random() * randomdialogue.length))];
                const embed = new Discord.MessageEmbed()
                .setAuthor({name: answer, iconURL: message.member.displayAvatarURL({dynamic: true})})
                .setDescription(`You harvested <:Coin:935379171897643120> ${withoutbonus} and ${bonus} as a BONUS!\n👛 You now have <:Coin:935379171897643120> ${coins}, do you think you got a little richer?`)
                .setFooter({text: `You are using ${plants[Plant]['name']} to harvest right now`})
                .setTimestamp()
                .setColor('BLUE')
                message.channel.send({embeds: [embed]})
                UpdateMoney(message.member.id, dbversion)
                CommandCount(message.author.id, 1)
            } else {
                return message.channel.send("🥱 It seems like you don't own a plant. do `.plant` to get one!")
            }
        }
    }
}

async function CommandCount(id, count) {
    let getcommand = await GetData(id)
    if (getcommand.Counter === undefined) {
        (await connection).query(`INSERT INTO CommandCount (UserID, Count) VALUES ("${id}", "${count}")`)
    }else {
        getcommand.Counter++
        (await connection).query(`UPDATE CommandCount SET Count= "${getcommand.Counter}" WHERE UserID = "${id}"`)
    }
    return true;
}
async function GetData(id) {
    let endresult = {
        UserID: String(),
        Counter: Number()
    }
    await (await connection).query(`SELECT * FROM CommandCount WHERE UserID = "${id}"`).then(async (result) => {
        if (result[0][0] === undefined) return (endresult = {
            UserID: id,
            Counter: undefined    
        })

        endresult['Counter'] = Number(result[0][0]['Count'])
    }).catch(error => {
        endresult = {
            UserID: id,
            Counter: undefined
        }
    })
    return endresult
}

function ShortCoins(Coins) {
    if (isNaN(Coins)) throw new Error('Coins cannot be a character')
    if (Coins <= 1000 ) return Math.round(Coins * 10) / 10
    if (Coins >= 1000000000) return (Math.round((Coins / 1000000000) * 10) / 10) + `B`
    if (Coins >= 1000000) return (Math.round((Coins / 1000000) * 10) / 10) + `M`
    if (Coins > 1000)  return (Math.round((Coins / 1000) * 10) / 10) + `K` 
  }
async function GetUserID(id) {
    let data = await(await connection).query(`SELECT * FROM Blacklist WHERE UserID = "${id}"`)
  
    return data[0][0] ? data[0][0]["Bypass"] : undefined
}

async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
} 
async function GetMoney(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Money"] : undefined
}
async function UpdateMoney(id, coin) {
    (await connection).query(`UPDATE Plants SET Money="${coin}" WHERE UserID = "${id}"`)
    return true;
}
    

async function AddBlacklist(id, Answer) {
    (await connection).query(`INSERT INTO Blacklist (UserID, Answer) VALUES ("${id}", "${Answer}")`)
return true;
}