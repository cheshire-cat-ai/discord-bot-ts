import { RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction } from 'discord.js';

export interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void
}