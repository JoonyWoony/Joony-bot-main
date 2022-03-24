let Discord = require('discord.js')
module.exports = {
  name: 'pardon',
  aliases: ['unban'],
  category: 'misc',
  permissions: ['BAN_MEMBERS'],
  description: 'Unban a Member.',
  /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
  async execute(message, args) {
    const targetid = args[0] || message.mentions.users.first().id 
    const reason = args.slice(1).join(' ')  || 'no reason provided'
    const fetchbanned = await message.guild.bans.fetch()
    if(!fetchbanned.find((user) => user.user.id === targetid)) {
        let embed = new Discord.MessageEmbed()
        .setDescription('❌ User is not currently banned. We have checked the ban list, and found 0 results of the mentioned user,\n```ERR_NOT_BANNED```')
        .setColor('BLURPLE')
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        return message.reply({embeds: [embed]})
    } 
    try {
      let extra = 'lol';
      try {
        console.log(
            `${targetid} unbanned from ${message.guild.server.name}`
        )
      } catch (error) {
      }
      setTimeout(() => {
        message.guild.members.unban(targetid)
        const embed = new Discord.MessageEmbed()
          .setTitle('Unban Successful ✅')
          .setDescription(
            `<@!${targetid}> was unbanned from ${message.guild.name}!`
          )
          .addField('Unban Reason', `${reason.toString()}`)
          .addField('Responsible Moderator', `${message.author}[${message.author.id}]`)
          .setColor('GREEN')
          .setFooter(message.author.tag, message.author.displayAvatarURL())
          .setTimestamp();

        message.channel.send({embeds: [embed]});
        console.log(`${targetid} was banned in ${message.guild.name} with no errors. EXIT CODE 0`)
      }, 1000);
    } catch (error) {
      message.channel.send(
        `I could not ban the given member, make sure that my role is above member! ❌`
      );
    }
  },
};

