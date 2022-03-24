const Discord = require('discord.js')
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = { 
    name: "vouch",
    aliases: ['rep'],
    category: 'misc',
  /**
   * @param {Discord.Message} message
   * @param {Array} args
   */ 
    async execute(message, args) {
        let member = message.mentions.members.first()
        let target = message.guild.members.cache.get(`${member.id}`)
            if (args.length >= 2) { 
                args.shift();
                reason = args.join(' ');
            } else reason = 'No reason provided'
            if (target.id === message.author.id) {
                let embed = new Discord.MessageEmbed()
                .setDescription('❌ You cannot vouch yourself.\n```ERR_REP_MYSELF```')
                .setColor('BLURPLE')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                return message.reply({embeds: [embed]})
            }
            let servericon = message.member.guild.iconURL()
            let targetreps = (await GetData(target.id)).Reputation
            let embed = new Discord.MessageEmbed()
            .setAuthor(`Reputation Success ✅`, servericon)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true}))
            .setDescription(`You gave a reputation to ${member}\nYou now have ${targetreps + 1}!\nTo check your current reps, do .reps <@User>`)
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor("#0ba0e6")
            message.channel.send({embeds: [embed]})
            AddRep(target.id, 1)
    }
}


async function AddRep(id, count) {
    let d = await GetData(id)
    if (d.Reputation === undefined) {
        (await connection).query(`INSERT INTO Vouches (UserID, Reputations) VALUES ("${id}", "${count}")`)
    }else {
        d.Reputation++
        (await connection).query(`UPDATE Vouches SET Reputations = "${d.Reputation}" WHERE UserID = "${id}"`)
    }
    return true;
}

async function GetData(id) {
    let endresult = {
        UserID: String(),
        Reputation: Number()
    }
    await (await connection).query(`SELECT * FROM Vouches WHERE UserID = "${id}"`).then(async (result) => {
        if (result[0][0] === undefined) return (endresult = {
            UserID: id,
            Reputation: undefined
        })

        endresult['Reputation'] = Number(result[0][0]['Reputations'])
    }).catch(error => {
        endresult = {
            UserID: id,
            Reputation: undefined
        }
    })      
    return endresult
}