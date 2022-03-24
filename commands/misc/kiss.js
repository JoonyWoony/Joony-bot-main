require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
  name: 'kiss',
  category: 'misc',
  async execute(message) {
      let url = `https://g.tenor.com/v1/search?q=Anime_Kiss&key=${process.env.TENOR}&limit=40`;
      try {
        let user = message.mentions.members.first() || message.author
        let Random = [`You kissed ${user}..! OwO`,`Dam...You kissed ${user}..Wow!`,`Nice, You kissed ${user}.`,`OWO! That was unexpected... you kissed ${user} on the lips..`]
        let answer = Random[Math.floor((Math.random() * Random.length))];
        let response = await fetch(url);
        let { results } = await response.json();
        let randomResult = results[Math.floor(Math.random() * results.length)];
        let { gif } = randomResult.media[0];
        let embed = new Discord.MessageEmbed()
        .setDescription(answer)
        .setColor('BLURPLE')
        .setImage(gif.url)
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.log(err);
        message.channel.send('There was an error using this command.');
      }
  },
};