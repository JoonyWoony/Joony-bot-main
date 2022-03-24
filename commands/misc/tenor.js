require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
  name: 'tenor',
  category: 'misc',
  async execute(message, args) {
      let search = args[0]
      let url = `https://g.tenor.com/v1/search?q=${search}&key=${process.env.TENOR}&limit=20`;
      try {
        let user = message.mentions.members.first() || message.author
        let response = await fetch(url);
        let { results } = await response.json();
        let randomResult = results[Math.floor(Math.random() * results.length)];
        let { gif } = randomResult.media[0];
        let embed = new Discord.MessageEmbed()
        .setDescription(`${user} Heres a random photo from your current search: **${search}**!`)
        .setColor('BLURPLE')
        .setImage(gif.url)
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.log(err);
        message.channel.send('There was an error using this command. Please contact the developer.');
      }
  },
};