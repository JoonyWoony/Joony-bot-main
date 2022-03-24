const Discord = require('discord.js');
const fs = require('fs');

function clean(text) {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  }
  
module.exports = {
    name: "eval",
    category: 'developer',
    permissions: "ADMINISTRATOR",
    async execute(message, args) {
      if (message.author.id !=='584996880748904459') return
      try {
        var code = args.join(" ");
        if (code === "client.token")
          return message.channel.send("Dont wanna do that 0_0");
        var evaled = eval(code);
  
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
  
        const embed = new Discord.MessageEmbed()
          .setColor(`#00ff22`)
          .addField(":inbox_tray: Input: ", `\`\`\`js\n${code}\`\`\``)
          .addField(
            ":outbox_tray: output: ",
            `\`\`\`js\n${clean(evaled)}\n\`\`\``
          );
        message.channel.send({embeds: [embed]});
      } catch (err) {
        const embed = new Discord.MessageEmbed()
          .setColor(`#00ff22`)
          .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
          .addField(":outbox_tray: output: ", `\`\`\`${clean(err)}\`\`\``);
        message.channel.send({ embeds: [embed] });
      }
    },
  };