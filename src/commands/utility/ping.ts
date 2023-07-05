import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { colorByNumber, sleep } from '../../utils/helpers';
import { Command } from '../../utils/types';

const cmd: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency between you and the bot in ms (milliseconds)'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ content: '***Pinging the Cheshire Cat***', ephemeral: true });
		const pArr = ['.', '..', '...'];
		for (let i = 0; i < 3; i++) {
			await sleep(750);
			await interaction.editReply({ content: `***Pinging the Cheshire Cat${pArr[i]}***` });
		}
		const ping = new EmbedBuilder()
			.setColor(colorByNumber(Math.round(interaction.client.ws.ping)))
			.setTitle('***Pong !***')
			.setDescription(`:ping_pong: \`${Math.round(interaction.client.ws.ping)} ms !\``);
		await interaction.editReply({ embeds: [ping] });
	},
};

export default cmd