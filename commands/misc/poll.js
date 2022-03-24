const Discord = require('discord.js');
const fetch = require('node-fetch')
module.exports = {
    name: 'poll',
    category: 'misc',
    aliases: ['po'],
    /** 
     * @param {Message} message
     * @param {String[]} args
    */
    async execute(message, args) {
        const poll = args.join(' ')  || '❌ no poll reason provided.'
        let PollEmbed = new Discord.MessageEmbed()
        .setTitle(`${poll}`)
        .addField('Reaction Info',`✅ = Yes [AGREE]\n❌ = No [DISAGREE]`)
        .setFooter(`Poll created by ` + message.author.tag, message.author.displayAvatarURL()).setTimestamp()
        .setColor('BLURPLE')
    message.channel.send({embeds: [PollEmbed]}).then(msg => {
        msg.react('✅')
        msg.react('❌')
        let Confirm = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`✅ Sent your poll: **${poll}**`)
        message.channel.send({embeds: [Confirm]}).then(newmsg => {
            setTimeout(function() {
                newmsg.delete()
            }, 2000)
        })
    })
    }
};