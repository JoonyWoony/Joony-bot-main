const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "8b",
    category: "misc",
    description: "8ball randomised.",
    /**
   * @param {Discord.Message} message
   * @param {Array} args
   */
    async execute(message, args) { 
        let question = args.join(' ')  || '❌ no question provided.'
        let Random = ["Nope.. Definitely not.","Yeah, Sure.","Yes.. I agree.","No... What?","N0Pe..","YES!","Of course ~ !","Maybe...","No. I don't think so","Maybe **NOT**.","YUS.","Hmmm...Yes.","Ahem.. No?","Mhm.","Yeah.. I guess"]
        let answer = Random[Math.floor((Math.random() * Random.length))];
        if (!args[0]) return message.reply("❌ You have not provided a question. Answer with a question next time.")
        const EightBall = new MessageEmbed()
        .setAuthor(`🎱 ${message.author.username}'s Question`)
        .addField('🔃 Your question', question)
        .addField('🔄 My answer', answer)
        .setColor('DARK_BUT_NOT_BLACK')
        message.channel.send({embeds: [EightBall]})
    }
}

//ur mum