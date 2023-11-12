import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '@utils/types';

const cmd: Command = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDescription('Deletes a specific number of messages in the channel in which it is executed')
		.addIntegerOption(option =>
            option.setName('amount').setDescription('The number of messages to delete')
                .setRequired(true).setMinValue(1).setMaxValue(50),
        )
        .toJSON(),
	async execute(interaction: ChatInputCommandInteraction) {
		const amount = interaction.options.getInteger('amount', true)
        const messages = await interaction.channel?.messages.fetch({ limit: amount })
        await interaction.reply({ content: `***Deleting ${amount} messages...***` })
        const channel = interaction.channel
        if (channel?.type == ChannelType.GuildText && messages) await channel?.bulkDelete(messages, true)
        const success = new EmbedBuilder()
            .setColor('#00AE86')
            .setDescription(`✅ ***Successfully deleted ${amount} messages !***`);
        const res = await interaction.editReply({ content: '', embeds: [success] });
        setTimeout(() => res.delete(), 3000)
	},
};

export default cmd