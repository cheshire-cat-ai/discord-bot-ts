import { Client as BotClient, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { CatClient } from 'ccat-api';
import clear from 'clear';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { Command } from '@utils/types';

clear();
dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error('A Bot token must be set to make it work!')
}

if (!process.env.URL) {
    throw new Error('A base URL to which connect the Cheshire Cat must be set to make it work!')
}

const client = new BotClient({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildEmojisAndStickers,
] }) as BotClient & { commands: Collection<string, Command> };

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

export const cat = new CatClient({
	baseUrl: process.env.URL,
	port: process.env.PORT,
	authKey: process.env.AUTH_KEY,
})

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = (await import(filePath)).default as Command;
			console.log(`Command '${command.data.name}' loaded.`)
			client.commands.set(command.data.name, command);
		}
	}
	try {
		if (!process.env.CLIENT_ID) {
			throw new Error('A Bot client ID must be set to make it work!')
		}
		console.log(`Started refreshing ${client.commands.size} application (/) commands.`);
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: client.commands.map(c => c.data),
		});
		console.log(`Successfully reloaded ${client.commands.size} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, msg => {
	if (msg.author.id === client.user?.id) return;

	if (msg.author.bot) return;

	if (msg.mentions.members?.first()?.user.id === client.user?.id) {
		cat.send(msg.content.replace(`<@${client.user?.id}>`, '').trim())
		cat.onMessage(res => msg.reply(res.content))
	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.BOT_TOKEN);