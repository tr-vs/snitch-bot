const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, ApplicationCommandRegistry } = require('@sapphire/framework');

class UwuCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'uwu',
        });
    }
    registerApplicationCommands(registry) {
		// Registering with the discord.js options object
		registry.registerChatInputCommand({
			name: this.name,
			description: 'Sends a uwu in chat'
		});

		// Registering with the builder
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription('Sends a uwu in chat');
		registry.registerChatInputCommand(builder);

		// Registering with the builder provided by the method
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription('Sends a uwu in chat')
		);
	}

    async chatInputRun(CommandInteraction) {
        return await interaction.reply('pong');
    }
}

module.exports = {
    UwuCommand
};