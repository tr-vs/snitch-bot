const { Command, RegisterBehavior } = require('@sapphire/framework');
const { SlashCommandBuilder } = require('@discordjs/builders');
const paster = require('paster.js');

class EvalCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'eval',
            description: 'Evaluates JavaScript code',
            preconditions: ['OwnerOnly']
        });
    }

    registerApplicationCommands(registry) {
        const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addStringOption(option => 
                option
                    .setName('code')
                    .setDescription('The code to evaluate.')
                    .setRequired(true)
            )
		registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: ['720435717192548374']
        });
    }

    async clean(token, text) {
        if (text && text.constructor.name == 'Promise') text = await text;
        if (typeof text !== 'string') {
            text = require('util').inspect(text, {
                depth: 1
            });
        }
        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(token, '<TOKEN>');

        return text;
    }

    async chatInputRun(interaction) {
        const code = interaction.options.getString('code', true);
        try {
            const evaled = await eval(code);
            const clean = await this.clean(interaction.client.token, evaled);
            if (clean.length > 800) {
                const paste = await paster.create(clean);
                interaction.reply(paste.link);
            } else interaction.reply(`\`\`\`js\n${clean}\n\`\`\``);
        } catch (err) {
            interaction.reply(
                `\`ERROR\` \`\`\`xl\n${await this.clean(
                    this.client,
                    err
                )}\n\`\`\``
            );
        }
    }
}

module.exports = {
    EvalCommand
};