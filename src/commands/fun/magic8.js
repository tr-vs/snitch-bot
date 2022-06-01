const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');

class Magic8Command extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'magic8ball',
            description: 'Ask the bot a random question with a yes or no answer.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['955251639701340180']
		});
	}

    async chatInputRun(interaction) {
        const response = ['As I see it, yes.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don’t count on it.', 'It is certain.', 'It is decidedly so.', 'Most likely.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Outlook good.', 'Reply hazy, try again.', 'Signs point to yes.', 'Very Doubtful.', 'Without a doubt', 'Yes.', 'Yes - definitely.', 'You may rely on it.'];
        interaction.reply({ content: '🎱| Let me see...', fetchReply: true })
			.then((msg)=> {
				setTimeout(function() {
					msg.edit(response[Math.floor(Math.random() * response.length)]);
				}, 2000);
			});
    }
}

module.exports = {
    Magic8Command
};