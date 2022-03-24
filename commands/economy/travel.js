let Discord = require('discord.js')
const plants = require('../../imported values/plants')
const mysql = require('mysql2/promise');
let ms = require('ms')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "treasure",
    aliases: ['travel','explore'],
    category: "economy",
    description: "travel",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let verification = Math.floor((Math.random() * 30)+ 1)
        if (verification > 26) {
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
        } else {
            let cooldownsecond = 21600000
            let Cooldown = await GetCooldown(message.author.id)
            if (Cooldown !== null && cooldownsecond - (Date.now() - Cooldown) > 0) {
                let format = ms(cooldownsecond - (Date.now() - Cooldown))
                message.channel.send(`☹ Hey! You still have ${format} until you can explore again. Get more coins in the meantime 😇`)
            }
            else {
                let Diamonds = await GetDiamond(message.author.id)
                let diamond = Math.floor(Math.random() * 50);
                let DiamondTotal = Diamonds + diamond
                let member = message.author
                let coin = Math.floor(Math.random() * 25000);
                let getcoin = await GetMoney(message.author.id)
                let CoinTotal = coin + getcoin
                let randomdialogue = [`🪐 Timeless Devil`,`🪐 Planet Joony`,`🪐 HAVEN`,`🪐 Angelica`,`🪐 USA`, `🪐 Saturn`,`🪐 Australia`,`🪐 Korea`, `🪐 Japan`,`🪐 Africa`, `🪐 Enlightment Planet`,`🪐 Cliffside Vein`,`🪐 Candy Land`,`🪐 Restorisation Fountain`,`🪐 Magical Forest`,`🪐 Boabob TREE`]
                let answer = randomdialogue[Math.floor((Math.random() * randomdialogue.length))]
                let lol = [`Traveller Johnessy found a 🦚 Peacock. ${member} and Traveller Johnessy found a huge cave.`,`Woah! 🕷 ${member} found a HUUUUGE cave and explored it!`,`🌊 a TSUNAMI! That was close...Anyways.. ${member} and Dentist Collin found a mysterious treasure`,`Did someone say SPACE EXPLORATION? Woah..`,`${member}-Almost got eaten by a Huge..and I mean HUGE Jumping shark 🦈🦈🩸`,`Shiny! Thats alot of coins 🤑🤑 ${member} found an abandoned monument!`,`You found a little 🐸 Frog! The frog gave ${member} some stuff.`,`Hehe.. That was fun 😁`,`🌵 Ouch! That hurts...${member} needs water...`,`${member} What was that 👀👀`,`${member} You-Observed..🥱 but slept in the middle.. because you were too tired!`,`${member} Woah?? 🐣 That exploration was great.`,`${member} explored a HUUUUUUUUUUGE cave 🚀`,`${member} pressed a button...`]
                let xd = lol[Math.floor((Math.random() * lol.length))];
                //`You obtained ${diamond} 💎 and ${coin}`
                let embed = new Discord.MessageEmbed()
                .setAuthor({name: `🦜You travelled to ${answer}! Let's see what you got!`})
                .setDescription(`${xd}`)
                .setColor('BLUE')
                message.channel.send({content: `⛏ ${message.author}, You are currently travelling...`, embeds: [embed]}).then(msg => {
                    setTimeout(function() {
                        let embed = new Discord.MessageEmbed()
                        .setAuthor({name: `🪐 Here are your profits from ${answer}!`})
                        .setDescription(`You obtained ${diamond} 💎 and <:Coin:935379171897643120> ${ShortCoins(coin)}\nYou now have 💎 ${DiamondTotal} and <:Coin:935379171897643120> Total Coins of ${ShortCoins(CoinTotal)}!`)
                        .setColor('BLUE')
                        msg.edit({content: "Hey! nicely done!",embeds: [embed]})
                    }, 3000)
                })
                UpdateCooldown(message.author.id, Date.now())
                UpdateDiamond(message.author.id, DiamondTotal)
                UpdateMoney(message.author.id, CoinTotal)
            }
        }
    }
}

function ShortCoins(Coins) {
    if (isNaN(Coins)) throw new Error('Coins cannot be a character')
    if (Coins <= 1000 ) return Math.round(Coins * 10) / 10
    if (Coins >= 1000000000) return (Math.round((Coins / 1000000000) * 10) / 10) + `B`
    if (Coins >= 1000000) return (Math.round((Coins / 1000000) * 10) / 10) + `M`
    if (Coins > 1000)  return (Math.round((Coins / 1000) * 10) / 10) + `K` 
  }

async function UpdateCooldown(id, Cooldown) {
    let maindata = await GetCooldown(id)
    if (maindata === undefined) {
        (await connection).query(`INSERT INTO Cooldown (UserID, Daily) VALUES ("${id}", "${Cooldown}")`)
    } else {
        (await connection).query(`UPDATE Cooldown SET Daily= "${Cooldown}" WHERE UserID = "${id}"`)
    }
}
async function GetCooldown(id) {
    let data = await(await connection).query(`SELECT * FROM Cooldown WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Daily"] : undefined
}

async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
} 
async function GetDiamond(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Diamond"] : undefined
}
async function GetMoney(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Money"] : undefined
}
async function UpdateMoney(id, Money) {
    (await connection).query(`UPDATE Plants SET Money="${Money}" WHERE UserID = "${id}"`)
    return true;
}
async function UpdateDiamond(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Diamond="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}
    

async function AddBlacklist(id, Answer) {
    (await connection).query(`INSERT INTO Blacklist (UserID, Answer) VALUES ("${id}", "${Answer}")`)
return true;
}