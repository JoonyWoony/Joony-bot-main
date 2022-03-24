let Discord = require('discord.js')
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
    name: "start",
    category: "economy",
    description: "travel",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let coins = 5000
        let bonuscoins = Math.floor((Math.random() * 15000)+ 1)
        let defaultcoin = coins + bonuscoins
        let cooldown = await GetCooldown(message.author.id)
        if (cooldown === 3) { 
            return;
        } else {
            let embed = new Discord.MessageEmbed()
            .setAuthor({name: `Welcome to Joony Economy, ${message.author.username}!`})
            .setDescription(`🌴 You just started your journey! Use \`.plant\` to get better plants first! The better the plants, the more <:Coin:935379171897643120> you earn 🤑!`)
            .addField('Beginner Crate 🧰',`You received <:Coin:935379171897643120> ${defaultcoin} & 🍌 Banana plant to start you off! Explore and conquer the economy, ${message.author.username}!`)
            .addField('❓ Need help?',`Use .help to find out all commands available!`)
            .setColor('YELLOW')
            message.channel.send({content: `A wild paradise awaits you, ${message.author.username}!`,embeds: [embed]})
            Reward(message.author.id, 'banana', defaultcoin)
            UpdateCooldown(message.author.id, 3)
        }
    }
}
async function GetCooldown(id) {
    let data = await(await connection).query(`SELECT * FROM Cooldown WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Start"] : undefined
}

async function Reward(id, plant, money) {
    (await connection).query(`INSERT INTO Plants (UserID, Plant, Money) VALUES ("${id}", "${plant}", "${money}")`)
    return true;
}
async function UpdateCooldown(id, Cooldown) {
    let maindata = await GetCooldown(id)
    if (maindata === undefined) {
        (await connection).query(`INSERT INTO Cooldown (UserID, Start) VALUES ("${id}", "${Cooldown}")`)
    } else {
        (await connection).query(`UPDATE Cooldown SET Start= "${Cooldown}" WHERE UserID = "${id}"`)
    }
}