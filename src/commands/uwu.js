const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');

class UwuCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'uwu',
        });
    }
    registerApplicationCommands(registry) {
		// Registering with the builder
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription('Sends a uwu in chat');
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374']
		});
	}

    async chatInputRun(interaction) {
        return await interaction.reply('pong');
    }
}

module.exports = {
    UwuCommand
};