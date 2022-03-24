let Discord = require('discord.js');
const mysql = require('mysql2/promise');
const tree = require('../../imported values/tree')
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    port: 3306,
    password: process.env.dbpass,
    database: process.env.db,
});

module.exports = {
    name: "forage",
    category: 'economy',
    aliases: ['foraging','fg'],
    cooldown: 1,
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) {
        let woodr = await GetWood(message.author.id)
        var rarities = [{
            type: "Apple",
            chance: 0
          }, {
            type: "Butternut",
            chance: 2000 
          }, {
            type: "Plum",
            chance: 1200
          }, {
            type: "Durian",
            chance: 700
          }, {
            type: "Fig",
            chance: 500 
          }, {
            type: "Peach",
            chance: 300
          }, {
            type: "Peach",
            chance: 100
          }, {
            type: "Custard",
            chance: 70
          }, {
            type: "Cacao",
            chance: 50
          }, {
            type: "Grape",
            chance: 10
          }, {
            type: "Mandarine",
            chance: 10
          }, {
            type: "Strawberry",
            chance: 2
          }];
          
          function pickRandom() {
            // Calculate chances for common
            var filler = 5000 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
          
            if (filler <= 0) {  
              console.log("chances sum is higher than 100!");
              return;
            }
          
            // Create an array of 100 elements, based on the chances field
            var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
          
            // Pick one
            var pIndex = Math.floor(Math.random() * 5000);
            let rarity = rarities[probability[pIndex]];
            let answer = rarity.type
            let name = tree[answer]['name']
            let amount = Math.floor((Math.random() * 50)+1);
            let wood = Math.floor(Math.random() * 100);
            let bozo = wood + woodr
            const embed = new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.username}'s Foraging | ${name}`})
            .setDescription(`${message.author.username}, You picked **${amount}** ${name} & **${wood}** 🍃🌲 Wood planks!\nYou now have **${bozo}** Planks`)
            .addField(`[${name}] Tree Found`,`${tree[answer]['info']}\nRarity: ${tree[answer]['rarity']}`)
            .setImage(`${tree[answer]['picture']}`)
            .setColor('GREEN')
            .setFooter({text: `Command executed by ${message.author.username}`})
            .setTimestamp()
            message.channel.send({embeds: [embed]})
            UpdateInventory(message.author.id, answer, amount)
            UpdateWood(message.author.id, bozo)
            //giggly giggly goo
          }
        pickRandom()
    }
}
async function GetShard(id, shard) {
  let data = await(await connection).query(`SELECT * FROM Mine WHERE UserID = "${id}"`)
  return data[0][0] ? data[0][0][`${shard}`] : undefined
}

async function UpdateInventory(id, fruit, add) {
    let getcommand = await GetShard(id, fruit)
    if (getcommand === undefined) {
        (await connection).query(`INSERT INTO Inventory (UserID, ${fruit}) VALUES ("${id}", "${add}")`)
    }else { 
        (await connection).query(`UPDATE Inventory SET ${fruit}= "${getcommand + add}" WHERE UserID = "${id}"`)
    }
    return true;
}

async function GetInv(id, fruit) {
    let data = await(await connection).query(`SELECT * FROM Inventory WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0][`${fruit}`] : undefined
}
async function GetWood(id) {
    let data = await(await connection).query(`SELECT * FROM Inventory WHERE UserID = "${id}"`)
    return data[0][0] ? data[0][0][`Wood`] : undefined
}
async function UpdateWood(id, Wood) {
    (await connection).query(`UPDATE Inventory SET Wood="${Wood}" WHERE UserID = "${id}"`)
    return true;
}