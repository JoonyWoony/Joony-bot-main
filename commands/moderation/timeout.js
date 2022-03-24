const { DiscordAPIError } = require("discord.js");
const { Message,MessageEmbed, Client } = require("discord.js");
const ms = require('ms');
module.exports = {
    name: "timeout",
    description: 'Give the mentioned member timeout',
    usage: '<Mention Member> <Time> [reason]',
    category: "moderation",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    async execute(message, args) {
        const user = message.mentions.members.first()
        const length = args[1]
        const reason = args.slice(2).join(' ')  || 'no reason provided'
        if(!message.channel.permissionsFor(message.guild.me).has('MODERATE_MEMBERS')){
            message.channel.send('❌ Unlucky! I am missing `ADMINISTRATOR` or `TIMEOUT_MEMBERS` permission. Please give me one to use this command ') }
            if(!message.member.permissions.has('MODERATE_MEMBERS')){
            return message.channel.send('❌ You do not have`ADMINISTRATOR` or `TIMEOUT_MEMBERS` permission.') }
        if (user.roles.highest.position > message.member.roles.highest.position || user.roles.highest.position === message.member.roles.highest.position) return message.channel.send('You cannot timeout someone with an equal or higher role');

        const timer = ms(length);
        
        if (!timer)
        return message.channel.send("Please specify the time!");
        const Tembed = new MessageEmbed()
        .setTitle('Timeout Sucessful ✅')
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true}))
        .setColor('RED')
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .addFields(
            {
                name: 'Member Name',
                value: `${user.user.tag.toString()} (${user.user.id})`,
                inline: false
            },
            {
                name: 'Timeout Reason',
                value: `${reason.toString()}`,
                inline: false
            },
            {
                name: 'Duration',
                value: `${length.toString()}`,
                inline: true
            }
            )
        .setTimestamp()
        let DMEmbed = new MessageEmbed()
        .setTitle(`You have received a Timeout from ${message.guild.name}!`)
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true}))
        .setDescription("You won't be able to speak, react or chat during the timeout.")
        .addField('Information',`Your Profile: ${user.user.tag.toString()}(**${user.user.id}**)\nModerator Responsible: ${message.member}`)
        .addField('Duration/Reason',`Your timeout will last for ${length.toString()}! After the duration expires, you will be unmuted automatically.\n**Reason for timeout**: ${reason.toString()}`)
        .setColor('AQUA')
        user.timeout(timer, [reason]);
        user.send({embeds: [DMEmbed]})
        message.channel.send({embeds: [Tembed]}
        );
    },
};
