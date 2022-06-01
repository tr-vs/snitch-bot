const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const Hit = require('../../Functions/JUUL/hit.js') 
const Pass = require('../../Functions/JUUL/pass.js') 
const Fetch = require('../../Functions/JUUL/fetch.js');
const Balance = require('../../Functions/JUUL/balance.js');
const Record = require('../../Functions/JUUL/record.js');
const Leaderboard = require('../../Functions/JUUL/leaderboard.js');
const Status = require('../../Functions/JUUL/status.js');
const { shop } = require('../../Functions/econ.js');

class JuulCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'JUUL',
            description: 'Engage in an economy system featuring JUUL hits and pods.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand => 
                subcommand
                    .setName('hit')
                    .setDescription('Hit the JUUL once it\'s passed to you.')
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('pass')
                    .setDescription('Pass the JUUL to someone.')
                    .addUserOption(option => option.setName('user').setDescription('the user you wish the JUUL to be passed to.').setRequired(true))
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('fetch')
                    .setDescription('Get a JUUL for the server or reset it.')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('balance')
                    .setDescription('Check your balance of JUUL items & pods.')
                    .addUserOption(option => option.setName('user').setDescription('view another user\'s balance'))
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('record')
                    .setDescription('Check the record number of passes in the server.')
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('leaderboard')
                    .setDescription('View the leaderboard for hits in the server.')
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('status')
                    .setDescription('View who currently has the JUUL.')
            )
            .addSubcommand(subcommand => 
                subcommand
                    .setName('shop')
                    .setDescription('View what\'s available in the shop.')
            )
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
		});
	}

    async chatInputRun(interaction) {
        switch (interaction.options._subcommand) {
            case 'hit':
                await Hit(interaction);
                break;
            case 'pass':
                await Pass(interaction);
                break;
            case 'fetch':
                await Fetch(interaction);
                break;
            case 'balance':
                await Balance(interaction);
                break;
            case 'record':
                await Record(interaction);
                break;
            case 'leaderboard':
                await Leaderboard(interaction);
                break;
            case 'status':
                await Status(interaction);
                break;
            case 'shop':
                await Shop(interaction);
                break;
        }
    }
}

module.exports = {
    JuulCommand
};