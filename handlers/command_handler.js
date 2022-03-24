const fs = require("fs")

module.exports = (client, Discord) => {
	client.commands = new Discord.Collection();
	const commandFolders = fs.readdirSync('./commands');

	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			let command = await import(`./commands/${folder}/${file}`);
			client.commands.set(command.name, command);
		}
	}
};