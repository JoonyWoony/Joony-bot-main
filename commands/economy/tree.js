let Discord = require('discord.js');
const mysql = require('mysql2/promise');
const plants = require('../../imported values/plants')
let ms = require('ms')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "tree",
    category: 'economy',
    aliases: ['tree'],
    cooldown: '1',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let tree = await GetTree(message.author.id)
        let multiply = tree * 5
        let money = await GetMoney(message.author.id)
        let collect = money + multiply
        let cooldownsecond = 86400000
        let Cooldown = await GetCooldown(message.author.id)
        if (Cooldown !== null && cooldownsecond - (Date.now() - Cooldown) > 0) {
            let format = ms(cooldownsecond - (Date.now() - Cooldown))
            message.channel.send(`🌳 Hey! You still have ${format} until you can collect your enlightment tree! Get more coins in the meantime 😇`)
        } else {
            let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `Warning: ${message.author.username}, You are about to collect your enlightment tree 🌳`})
            .setDescription(`Are you sure? Please react to ✅ if you would like to collect.\nAfter collecting, you will be able to collect again within 24 hours.\nYour tree will be resetted as well 🌳☘!`)
            .setColor('BLURPLE')
            message.channel.send({embeds: [embed]}).then(msg=> {
                msg.react('✅')
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                }
                const collector = msg.createReactionCollector({
                    filter, 
                    max: 1,
                    time: 10000,
                })
                collector.on('collect', async (reaction) => {
                    message.channel.send(`Your collection was confirmed. You have collected ${multiply} coins.\nYour balance is now: ${collect}`)
                    UpdateMoney(message.author.id, collect)
                    DeleteTree(message.author.id)
                    UpdateCooldown(message.author.id, Date.now())
                })
            })
        }
    }
}
async function DeleteTree(id) {
    (await connection).query(`DELETE FROM Enlightment WHERE "${id}"`)
    return true;
}
async function UpdateMoney(id, Money) {
    (await connection).query(`UPDATE Plants SET Money="${Money}" WHERE UserID = "${id}"`)
    return true;
}
async function UpdateCooldown(id, Cooldown) {
    let maindata = await GetCooldown(id)
    if (maindata === undefined) {
        (await connection).query(`INSERT INTO Cooldown (UserID, Tree) VALUES ("${id}", "${Cooldown}")`)
    } else {
        (await connection).query(`UPDATE Cooldown SET Tree= "${Cooldown}" WHERE UserID = "${id}"`)
    }
}
async function GetCooldown(id) {
    let data = await(await connection).query(`SELECT * FROM Cooldown WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Tree"] : undefined
}

async function GetMoney(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0]["Money"] : undefined
}

async function AddTree(id, Answer) {
    (await connection).query(`INSERT INTO Enlightment (UserID, Tree) VALUES ("${id}", "${Answer}")`)
return true;
}
async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
}
async function GetTree(id) {
    let data = await(await connection).query(`SELECT * FROM Enlightment WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Tree"] : undefined
}
async function UpdatePlant(id, plant) {
    (await connection).query(`UPDATE Plants SET Plant="${plant}" WHERE UserID="${id}"`)
return true;
}

async function AddPlant(id, plant) {
    let lol = await GetTree(id)
    if (lol === undefined) {
        (await connection).query(`INSERT INTO Enlightment (UserID, Tree) VALUES ("${id}", "${plant}")`)
    } else {
        (await connection).query(`UPDATE Enlightment SET Tree = "${plant}" WHERE UserID = "${id}"`)
    }
    return true;
}
