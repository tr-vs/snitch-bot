const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const Add = require('../../functions/snitch/snitchAdd.js');
const List = require('../../functions/snitch/snitchList.js')
const Remove = require('../../functions/snitch/snitchRemove.js');

class SnitchCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'snitch',
            description: 'Allows you to be alerted when a message is sent which contains a specific word.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand => 
                subcommand
                    .setName('remove')
                    .setDescription('remove a term')
                    .addStringOption(option => option.setName('term').setDescription('the term which you wish to be removed').setRequired(true))
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('list')
                    .setDescription('view a list of all your snitch terms')
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('add')
                    .setDescription('Add a term which the bot will DM you if sent in the server')
                    .addStringOption(option => option.setName('term').setDescription('the term you wish to add').setRequired(true))
            )
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['978022379940896779']

		});
	}

    async chatInputRun(interaction) {
        switch (interaction.options._subcommand) {
            case 'remove':
                await Remove(interaction);
                break;
            case 'add':
                await Add(interaction);
                break;
            case 'list':
                await List(interaction);
                break;
        }
    }
}

module.exports = {
    SnitchCommand
};