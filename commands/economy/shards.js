let Discord = require('discord.js')
const mysql = require('mysql2/promise');
let shards = require('../../imported values/shard')
let plant = require('../../imported values/shop_plant')
let ms = require('ms')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "shard",
    category: "economy",
    description: "travel",
    cooldown: 50,
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let getplant = await GetPlant(message.author.id)
        let damage = await GetDamage(message.author.id)
        let getdiamond = await GetDiamond(message.author.id)
        var rarities = [{
            type: "Regeneration",
            chance: 0
          }, {
            type: "Plaster",
            chance: 1500
          }, {
            type: "Plant",
            chance: 1200
          }, {
            type: "Mimic",
            chance: 800
          }, {
            type: "Legion",
            chance: 300
          }, {
            type: "Epidote",
            chance: 200
          }, {
            type: "Galaxy",
            chance: 30
          }, {
            type: "Enlightment",
            chance: 10
          }, {
            type: "Dandrite",
            chance: 2
          }];
          //Dandrite Enlightment Galaxy Epidote Legion Mimic Plant Plaster Regeneration
          function pickRandom() {
            // Calculate chances for common
            var filler = 5000 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
          
            if (filler <= 0) {
              console.log("chances sum is higher than 1000!");
              return;
            }
          
            // Create an array of 100 elements, based on the chances field
            var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
          
            // Pick one
            var pIndex = Math.floor(Math.random() * 5000);
            var rarity = rarities[probability[pIndex]];
            let answer = rarity.type
            let name = shards[answer]['name']
            let numbershards = plant[getplant]['shard']
            let items = Math.floor((Math.random() * numbershards)+1);
            let gems = Math.floor((Math.random() * 10)+1);
            let damages = shards[answer]['attack']
            let main = damage + damages
            let diamond = getdiamond + gems
            let randomdialogue = [`Treasure! 🕸 AWHHHHHHH Cave spider invasion! 🕷 GROSS!`,`💣 BOOOOMMMM!! Rocky Trails! That was tight 😳`,`🔮 Magical Crystals.. Remember.. Don't touch cool things...`,`💰 Money..or shards? Which one..! Only pick one please 😳`,`Sensation? Was it fun in the cave? 😊`,`😮 Exploring is the favorite part of my hobby!`,`⛏ Mining Away..Maybe I'll get some shards!`,`⚠ That mine was worth the time! Or...Maybe not!`,`Is the cave vibrating? Quick...RUN ❗ Don't get yourself stuck out there!`,`Boom! After the ashes wear off.. You find some shards 💎Flashy!`]
            let answerdialogue = randomdialogue[Math.floor((Math.random() * randomdialogue.length))];
            UpdateShard(message.author.id, answer, items)
            const shardembed = new Discord.MessageEmbed()
            .setAuthor({name: `${answerdialogue}`, iconURL: message.member.displayAvatarURL({ dynamic: true})})
            .setDescription(`⛏ You mined **${items}** ${name} Shard & **${gems}**💎Gems\nYou now have ${ShortCoins(diamond)} 💎, and you will do 💪 ${ShortCoins(main)} damage overall !\nCheck your current balance by doing \`.bal\``)
            .setColor('LIGHT_GREY')
            .setFooter({text: `Command executed by ${message.author.username}`})
            .addField(`What are shards used for?`,`🦴🕸🦇 Shards can boost your attack damage in slayers and can be used to make ⚒🧰 artifacts !`)
            .setTimestamp()
            message.channel.send({embeds: [shardembed]})    
            UpdateDiamond(message.author.id, diamond)
            UpdateDamage(message.author.id, main)
          }
        if (plant[getplant]) { 
            pickRandom()
        } else {
            let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `❌ An error has occured.. `})
            .setDescription(`Seems like you do not own a plant that can give you shards! Go and buy one at \`.shop\`! Well that's if you have the diamonds for it ofc 😊`)
            .setColor("AQUA")
            .setFooter({ text: `${message.guild.name}`})
            .setTimestamp()
            message.channel.send({embeds: [embed]})
        }
    }
}
async function UpdateShard(id, shard, add) {
    let getcommand = await GetShard(id, shard)
    if (getcommand === undefined) {
        (await connection).query(`INSERT INTO Mine (UserID, ${shard}) VALUES ("${id}", "${add}")`)
    }else { 
        (await connection).query(`UPDATE Mine SET ${shard}= "${getcommand + add}" WHERE UserID = "${id}"`)
    }
    return true;
}

async function GetShard(id, shard) {
    let data = await(await connection).query(`SELECT * FROM Mine WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0][`${shard}`] : undefined
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
async function GetPlant(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Plant"] : undefined
}
async function GetDamage(id) {
    let data = await(await connection).query(`SELECT * FROM Plants WHERE UserID = "${id}"`)

    return data[0][0] ? data[0][0]["Damage"] : undefined
}
async function UpdateDamage(id, Diamond) {
    (await connection).query(`UPDATE Plants SET Damage="${Diamond}" WHERE UserID = "${id}"`)
    return true;
}