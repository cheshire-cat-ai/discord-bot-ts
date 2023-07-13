import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, version } from 'discord.js'
import sysinfo from 'systeminformation'
import { Command } from '@utils/types'

const cmd: Command = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDescription('Show the statistics about the Cheshire Cat AI bot').toJSON(),
	async execute(interaction: ChatInputCommandInteraction) {
		const load = await sysinfo.processes()
		const proc = load.list.find(v => v.pid === process.pid)
		let totalSeconds = (interaction.client.uptime / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		totalSeconds %= 3600
		const minutes = Math.floor(totalSeconds / 60), seconds = (totalSeconds % 60)
		let uth = '', utm = '', uts = ''
		if (hours < 10) uth = '0' + hours.toFixed(0); else uth = hours.toFixed(0)
		if (minutes < 10) utm = '0' + minutes.toFixed(0); else utm = minutes.toFixed(0)
		if (seconds < 10) uts = '0' + seconds.toFixed(0); else uts = seconds.toFixed(0)
		const uptime = `${uth}:${utm}:${uts}`
		const embedStats = new EmbedBuilder()
			.setColor(0x00AE86)
			.setTitle('***Statistics***')
			.addFields(
				{ name: 'Owner', value: '**Cheshire Cat AI organization**', inline: true },
				{ name: 'Uptime', value: `${uptime}`, inline: true },
				{ name: 'CPU usage', value: `${proc?.cpu.toFixed(2)} %`, inline: true },
				{ name: 'RAM usage', value: `${proc?.mem.toFixed(2)} %`, inline: true },
				{ name: 'Discord.JS', value: `v${version}`, inline: true },
				{ name: 'Node.JS', value: `${process.version}`, inline: true },
				{ name: 'Users', value: `${interaction.client.users.cache.size}`, inline: true },
				{ name: 'Channels', value: `${interaction.client.channels.cache.size}`, inline: true },
				{ name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
			)
		interaction.reply({ embeds: [embedStats] })
	},
}

export default cmd
