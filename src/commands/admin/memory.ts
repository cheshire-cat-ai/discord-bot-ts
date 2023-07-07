import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '@utils/types';
import { cat } from '@/index';

const cmd: Command = {
	data: new SlashCommandBuilder()
		.setName('memory')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDescription('Manage the memories in the Cheshire Cat instance')
		.addSubcommand(sub =>
			sub.setName('wipe').setDescription('Choose what to wipe in the long term memory')
			.addStringOption(option =>
				option.setName('collection').setDescription('The name of the collection to wipe').setRequired(true).addChoices(
					{ name: 'All', value: 'all' },
					{ name: 'History', value: 'history' },
				),
			),
		).toJSON(),
	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
            case 'wipe': {
				const collection = interaction.options.getString('collection', true)
                await interaction.reply({ content: '***Wiping all the collections...***' })
				switch (collection) {
					case 'all': {
						await cat.api.memory.wipeCollections()
						await interaction.editReply({ content: '***All the available collections were wiped successfully!***' })
						break;
					}
					case 'history': {
						await cat.api.memory.wipeConversationHistory()
						await interaction.editReply({ content: '***The conversation history was wiped successfully!***' })
						break;
					}
					default: {
						const collections = (await cat.api.memory.getCollections()).collections.map(c => c.name)
						if (collections.includes(collection)) {
							await cat.api.memory.wipeSingleCollection(collection)
							await interaction.editReply({ content: `***The collection \`${collection}\` was wiped successfully!***` })
						}
						break;
					}
				}
                break;
            }
            default: {
                await interaction.reply({ content: '***The selected command is not supported***' })
                break;
            }
		}
	},
};

export default cmd