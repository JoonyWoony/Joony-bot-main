const botConfig = require('../config/bot.json')
module.exports = {
	name: "message",
	category: "Message",
	async execute(message, client) {
		if (!message.content.startsWith(botConfig.prefix) || message.author.bot) return;

		const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;

		try {                                               
			await command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute this command, please try again ❌');
		}
	}
};

