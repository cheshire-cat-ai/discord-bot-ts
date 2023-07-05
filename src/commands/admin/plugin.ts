import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '@utils/types';
import { cat } from '@/index';

const cmd: Command = {
	data: new SlashCommandBuilder()
		.setName('plugin')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDescription('Manage the plugins in the Cheshire Cat instance')
		.addSubcommand(sub =>
			sub.setName('list').setDescription('Shows the list of plugins installed'),
		).toJSON(),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ content: '***Getting the list of plugins installed...***' })
		const plugins = await cat.api.plugins.listAvailablePlugins()
		await interaction.editReply({ content: `***Installed plugins***:\n- ${plugins.installed.map(p => p.name).join('\n- ')}` })
	},
};

export default cmd