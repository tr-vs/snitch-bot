const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

class InviteCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'invite',
            description: 'Generate an invite link for the bot.'
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
        const embed = new MessageEmbed().setDescription('[Click Here to Invite the Bot](https://discord.com/oauth2/authorize?client_id=965650290785284096&permissions=278300847168&scope=bot%20applications.commands)').setColor('2f3136');
		return message.util.send(embed);
    }
}

module.exports = {
    InviteCommand
};