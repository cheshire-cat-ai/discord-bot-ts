import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { AcceptedMemoryTypes, AcceptedMemoryType } from 'ccat-api';
import { Command } from '@utils/types';
import { cat } from '@/index';

const cmd: Command = {
	data: new SlashCommandBuilder()
		.setName('rabbithole')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDescription('Manage the Rabbit Hole in the Cheshire Cat instance')
		.addSubcommand(sub =>
			sub.setName('web').setDescription('Upload a website url to the Rabbit Hole')
				.addStringOption(option => option.setName('url').setDescription('The website url to ingest').setRequired(true)),
		).addSubcommand(sub =>
			sub.setName('memory').setDescription('Upload a memory json file to the Rabbit Hole')
				.addAttachmentOption(option => option.setName('json').setDescription('The memory to ingest').setRequired(true)),
		).addSubcommand(sub =>
			sub.setName('content').setDescription('Upload a file (text, markdown, pdf) to the Rabbit Hole')
				.addAttachmentOption(option => option.setName('file').setDescription('The file to ingest').setRequired(true)),
		).toJSON(),
	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
            case 'web': {
                const url = interaction.options.getString('url', true)
                await interaction.reply({ content: '***Uploading url to the Rabbit Hole...***' })
                await cat.api?.rabbitHole.uploadUrl({ url })
                await interaction.editReply({ content: `***Website \`${url}\` uploaded with success!***` })
                break;
            }
            case 'memory': {
                const json = interaction.options.getAttachment('json', true)
                if (!AcceptedMemoryTypes.includes(json.contentType as AcceptedMemoryType)) {
                    await interaction.editReply({ content: `***The file extension \`${json.contentType}\` is not supported!***` })
                    break;
                }
                await interaction.reply({ content: '***Uploading memory to the Rabbit Hole...***' })
                const blob = await fetch(json.url).then(r => r.blob())
                await cat.api?.rabbitHole.uploadMemory({ file: blob })
                await interaction.editReply({ content: '***Memory JSON file was uploaded with success!***' })
                break;
            }
            case 'content': {
                const file = interaction.options.getAttachment('file', true)
                const acceptedTypes = (await cat.api?.rabbitHole.getAllowedMimetypes())?.allowed
                if (!acceptedTypes || !file.contentType) return
                if (!acceptedTypes.includes(file.contentType)) {
                    await interaction.editReply({ content: `***The file extension \`${file.contentType}\` is not supported!***` })
                    break;
                }
                await interaction.reply({ content: '***Uploading file to the Rabbit Hole...***' })
                const blob = await fetch(file.url).then(r => r.blob())
                await cat.api?.rabbitHole.uploadFile({ file: blob })
                await interaction.editReply({ content: `***The file \`${file.name}\` was uploaded with success!***` })
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