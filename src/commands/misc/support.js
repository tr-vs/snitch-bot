const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

class SupportCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'support',
            description: 'Generate an invite link for the support server.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374']
		});
	}

    async chatInputRun(interaction) {
		const embed = new MessageEmbed().setDescription('[Click Here to Join the Support Server](https://discord.gg/hSB8TZyYhw)').setColor('2f3136');
		return message.util.send(embed);
    }
}

module.exports = {
    SupportCommand
};