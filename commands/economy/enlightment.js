let Discord = require('discord.js');
const mysql = require('mysql2/promise');
const plants = require('../../imported values/plants')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "enlightment",
    category: 'economy',
    aliases: ['tree'],
    cooldown: '1',
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let Plant = await GetPlant(message.author.id)
        let tree = await GetTree(message.author.id)
        let embed = new Discord.MessageEmbed()
        .setAuthor({name: `${message.author.username}'s Enlightment Tree 🌳`,})
        .setDescription(`🔮 The Emperor awaits you...\nHere, you can sacrifice the souls of the plants and refine the purification of the tree\nSacrificing will increase the money earned daily.`)
        .addField(`Your Enlightment Tree`,`Currently holding <:Coin:935379171897643120> ${tree}!`)
        .addField(`🐣 Sacrifice`,`React 🐣 to sacrifice your current plant.`)
        .setImage("https://i.imgur.com/4WYOOLK.jpg")
        .setColor('PURPLE')
        message.channel.send({ embeds: [embed]}).then(msg=> {
            msg.react('🐣')
            const filter = (reaction, user) => {
                return reaction.emoji.name === '🐣' && user.id === message.author.id;
            }
            const collector = msg.createReactionCollector({
                filter, 
                max: 1,
                time: 10000,
            })
            collector.on('collect', async (reaction) => {
                const coin = plants[Plant]['coin']
                let embed = new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.username}'s Sacrifice`})
                .setDescription(`${message.author}, You currently own ${Plant}. Would you like to sacrifice ${Plant} to the Enlightment Tree 🌳\nPlease react to ✅ If you wish to sacrifice.`)
                .setColor('BLURPLE')
                message.channel.send({embeds: [embed]}).then(msg => {
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
                        if (tree) {
                            let total = tree + coin
                            let embed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.username}'s Enlightment Tree 🌳`,})
                            .setDescription(`🔮 The emperor blesses your tree! Your tree will produce <:Coin:935379171897643120> ${total}\nSince you sacrified your plant, your plant has been updated to Soul Plant`)
                            .setColor('BLURPLE')
                            message.channel.send({embeds: [embed]})
                            AddPlant(message.author.id, total)
                            UpdatePlant(message.author.id, 'soul')
                        } else {
                            let embed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.username}'s Enlightment Tree 🌳`,})
                            .setDescription(`🔮 You didn't own a tree! We made a tree for you.\nYour tree will now produce <:Coin:935379171897643120> ${coin}\nSince you sacrified your plant, your plant has been updated to Soul Plant.`)
                            .setColor('BLURPLE')
                            message.channel.send({embeds: [embed]})
                            AddPlant(message.author.id, coin)
                            UpdatePlant(message.author.id, 'soul')
                        }
                    })
                })
            })
        })
    }
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
