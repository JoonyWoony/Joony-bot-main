let Discord = require('discord.js');
const { message } = require('noblox.js');
module.exports = {
  name: 'ban',
  aliases: ['b', 'permban'],
  category: 'misc',
  permissions: ['BAN_MEMBERS'],
  description: 'Ban a server member',
  /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
  async execute(message, args) {
    if (message.mentions.users.size === 0)
      return message.reply('Please mention a user to ban ❌');
    const targetid = message.mentions.users.first().id;
    if (targetid === message.client.user.id) {
        let embed = new Discord.MessageEmbed()
        .setDescription('❌ You cannot ban me. I will not allow that 😡\n```ERR_BOT_BAN```')
        .setColor('BLURPLE')
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        return message.reply({embeds: [embed]})
    }
    if (targetid === message.author.id) {
        let embed = new Discord.MessageEmbed()
        .setDescription('❌ You cannot ban yourself. Another member has to ban you to achieve this.\n```ERR_BAN_ME```')
        .setColor('BLURPLE')
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        return message.reply({embeds: [embed]})
    }
    const targed = await message.guild.members.cache.get(targetid);
    if (message.member.roles.highest.position <= targed.roles.highest.position) {
        let embed = new Discord.MessageEmbed()
        .setDescription('❌ You cannot ban a member of the same level or higher. Your rank is not suitable to ban this person.\n```ERR_ROLE_HIGH```')
        .setColor('BLURPLE')
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        return message.reply({embeds: [embed]})
    }
    let reason = [];
    if (args.length >= 2) {
      args.shift();
      reason = args.join(' ');
    } else reason = 'No reason was provided!';
    try {
      let extra = '';
      try {
        let invite = await message.channel.createInvite()
        let servericon = message.member.guild.iconURL()
        let embed = new Discord.MessageEmbed()
        .setAuthor(`You were banned from ${message.guild.name}`, `${servericon}`)
        .setThumbnail(targed.user.displayAvatarURL({dynamic: true}))
        .setDescription('You have been banned.. OWO! Ask your responsible moderator to unban you if it was a mistake. Goodbye....')
        .addField('Reason',`Reason for Ban: ${reason}\n${extra}`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor('BLURPLE');
        const row = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
          .setLabel('Try Rejoin')
          .setStyle('LINK')
          .setURL(`${invite}`)
        )
        targed.send({embeds: [embed], components: [row]})
      } catch (error) {
        extra = 'Messaging the user has failed! ❌ Does the target has **DMS** open?';
        console.log(error)
      }
      setTimeout(() => {
        targed.ban({reason: reason});
        const embed = new Discord.MessageEmbed()
          .setTitle('Ban Successful ✅')
          .setDescription(
            `${targed.tag || targed.user.username} has been banned from **${
              message.guild.name}**\nReason: **${reason}\n${extra}**`
          )
          .setColor('GREEN')
          .setFooter(`Reponsible Moderator [ ${message.author.tag} ]`,message.author.displayAvatarURL())
          .setTimestamp()

        message.channel.send({embeds: [embed]});
        console.log(`${targed} was banned in ${message.guild.name} with no errors. EXIT CODE 0`)
      }, 400);
    } catch (error) {
      message.channel.send(
        `I could not ban the given member, make sure that my role is above member! ❌`
      );
    }
  },
};


