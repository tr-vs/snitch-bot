const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

class OptOutCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'optout',
            description: 'Opt out from having your message content data tracked.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
		});
	}

    async chatInputRun(interaction) {
        interaction.reply({ content: 'Opted-out from message content tracking!', fetchReply: true })
    }
}

module.exports = {
    OptOutCommand
};