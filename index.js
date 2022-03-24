const Discord = require('discord.js') 
const chalk = require('chalk')
const config = require('./config/bot.json')
const ms = require('ms')
const fs = require('fs');
const myintents = new Discord.Intents();
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: process.env.dbhost,
  user: process.env.dbuser,
  port: 3306,
  password: process.env.dbpass,
  database: process.env.db,
});
myintents.add( 
  "GUILDS",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS",
  "DIRECT_MESSAGE_REACTIONS",
  "GUILD_MEMBERS",
  "GUILD_PRESENCES" 
);
const client = new Discord.Client({
  intents: myintents,
  partials: [],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

async function GetBlacklist(id) {
  let data = await(await connection).query(`SELECT * FROM Blacklist WHERE UserID = "${id}"`)

  return data[0][0] ? data[0][0]["Answer"] : undefined
} 
async function GetUserID(id) {
  let data = await(await connection).query(`SELECT * FROM Blacklist WHERE UserID = "${id}"`)

  return data[0][0] ? data[0][0]["UserID"] : undefined
} 

client.on("guildCreate", async (guild) =>{
  console.log(`added to ${guild.id}`)
  let embed = new Discord.MessageEmbed()
  .setAuthor({name: `💘 Thanks for using Joony!`})
  .setDescription('Hewwo! Sup! My name is **Joony**. Start your journey in ECONOMY by doing `.start`.Here are all the commands that I have right now. If you need help, join our [support server](https://discord.gg/CMCE2CZenb)! ')
  .addField('🛶 MISC','`HELP`')
  .addField('💭 OTHER/FUN','`HOWLOVE` | `8B` | `PING` | `POLL` | `KISS` | `HUG` | `TENOR`')
  .addField('🎟 ADMINISTRATOR','`TIMEOUT` | `BAN` | `UNBAN/PARDON` | `EVAL` | `RELOAD` ')
  .addField('👛 Economy','`PLANT` | `INVENTORY/I` | `BAL` | `HARVEST` | `BETALL` | `BET` | `TRAVEL` | `LAB` | `FF` | `BIG` | `GIVEMONEY` | `GIVEPLANT` | `DOCS`')
  .setTitle('Prefix - `.`')
  .setColor('BLURPLE')
  .setTimestamp()
  const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
          .setLabel('Support Server')
          .setStyle('LINK')
          .setURL('https://discord.gg/g7xpVcAESq'),
      new Discord.MessageButton()
          .setLabel('Add to Server')
          .setStyle('LINK')
          .setURL('https://discord.com/oauth2/authorize?client_id=930328042017005658&scope=bot&permissions=8')
  )

  guild.systemChannel.send({components: [row], embeds: [embed], content: `Thanks for using **Joony** bot! Start your 👛 ECONOMY adventure by doing \`.start\``})
})

client.commands = new Discord.Collection(); 
const cooldowns = new Discord.Collection();
const CommandFolders = fs.readdirSync("./commands").filter((object) => {
  return fs.lstatSync(`./commands/${object}`).isDirectory();
});
(async () => {
for (const folder of CommandFolders) {
  console.log(chalk.redBright(`Command Category Found: ${folder}`));
  const FolderCommands = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of FolderCommands) {
    const command = require(`./commands/${folder}/${file}`); 
    if (!command.category)
      console.log(
        chalk.redBright(
          `Command found without Category: ${command.name}\nThis can result in a error!`
        )
      );
    console.log(chalk.greenBright(`Command '${command.name}' registered`));
    client.commands.set(command.name, command);
  }
}})()

client.on("ready", async () => {
  console.log(chalk.redBright(`Bot is now online! Logged in sucessfully ✅`))
  setInterval(() => {
  let RandomStatus = [`Listening to ${client.guilds.cache.size} servers | .help`, `Listening to .plant | Finding friends :D`, `Cooking in the oven | Listening to .help`,`Caching ${client.guilds.cache.size} servers | .help`]
  let random = RandomStatus[Math.floor(Math.random() * RandomStatus.length)];
  client.user.setActivity(random)
  }, 10000);
});

client.on("messageCreate", async (message) => {
  const Blacklisted = await GetBlacklist(message.author.id)
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content
    .slice(String(config.prefix).length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = 
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  if (command) {
    if (Blacklisted === 'Blacklisted') {
      let embed = new Discord.MessageEmbed()
      .setDescription('You have been blacklisted by a Bot Moderator.')
      .addField('Appeal Server',`(Click HERE)[https://discord.gg/FUN6xD2PZh]`)
      .setColor('RED')
      .setFooter({ text: `${message.author.id} | ${message.guild.name}`})
      .setTimestamp()
      return message.reply({embeds: [embed]})
    }
  }
  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (
      !authorPerms ||
      (!authorPerms.has(command.permissions) &&
        message.author.id !== "233592823562240000" &&
        message.author.id !== "584996880748904459")
    ) {
      return message.reply("Hey there! You do not have permissions to execute this command. Sorry!");
    }
  }
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime && message.author.id !== config.devid) {
      const timeLeft = (expirationTime - now) / 1000;
      if (command.autodelete) message.delete();
      return message
        .reply(
          `⚠ Hey.. pls slow down, you still have ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        )
        .then((msg) => {
          if (command.autodelete === true) msg.delete({ timeout: ms("20s") });
        });
    }
  }
  timestamps.set(message.author.id, now);
  command.execute(message, args);
});

client.login(process.env.BOT_TOKEN);

process.on("unhandledRejection", (error) => {
  if (error instanceof Discord.DiscordAPIError) Error.captureStackTrace(error);
  console.warn(error); //ERROR progress WIP
});


