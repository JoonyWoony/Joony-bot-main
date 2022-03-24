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
    name: "test",
    category: "economy",
    description: "travel",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let cooldown = await GetCooldown(message.author.id)
        let embed = new Discord.MessageEmbed()
        .setDescription('hello test')
        .setColor('BLUE')
        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setLabel('Damage Boss')
                .setStyle('SUCCESS')
                .setCustomId('Damage')
                .setEmoji('⛏')
        )
        message.channel.send({components: [row], embeds: [embed]}).then(msg=> {
            const filter = i => i.customId === 'Open' && i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 15000,
            })
            collector.on('collect', async collect => {
                if (collect.customId === 'Damage') {
                    let main = cooldown - 1
                    if (main === 1) {
                        msg.edit({content: 'xd ur boss died', embeds: [], components: []})
                        UpdateCooldown(message.author.id, 1)
                    } else {
                        if (main === 0) {
                            message.channel.send('lol')
                        } else {
                            let embed = new Discord.MessageEmbed()
                            .setDescription(`You did 1 damage! you now have ${main} hp to go`)
                            msg.edit({embeds: [embed], components: []})
                            UpdateCooldown(message.author.id, main)
                        }
                    }
                }   
            })
        })
    }
}

async function GetCooldown(id) {
    let data = await(await connection).query(`SELECT * FROM Cooldown WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Test"] : undefined
}

async function UpdateCooldown(id, Cooldown) {
    let maindata = await GetCooldown(id)
    if (maindata === undefined) {
        (await connection).query(`INSERT INTO Cooldown (UserID, Test) VALUES ("${id}", "${Cooldown}")`)
    } else {
        (await connection).query(`UPDATE Cooldown SET Test= "${Cooldown}" WHERE UserID = "${id}"`)
    }
}