const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

class CoinFlipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'coinflip',
            description: 'Flip a coin.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addStringOption(option => option.setName('wish').setDescription('whatever you\'re wishing for'))
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['955226335033299045']
		});
	}

    async chatInputRun(interaction) {
        const wish = interaction.options.getString('wish') ? interaction.options.getString('wish') : '`...`';
        const chance = Math.floor(Math.random() * 2) + 1;
		let img = '';
		let desc = '';
		if (chance == 1) {
			img = 'https://images-ext-1.discordapp.net/external/VjciSSNl9gb1yAllUsViEvFb0gQSrNXYJPHt7_xhwgM/https/i.imgur.com/BvnksIe.png';
			desc = 'It was heads.';
		}
		if (chance == 2) {
			img = 'https://images-ext-1.discordapp.net/external/FD5cT0UrCMNdkjZjleMI7M7lr94cuWhbYqVYpwKRMAY/https/i.imgur.com/i6XvztF.png';
			desc = 'It was tails.';
		}
		const embed = new MessageEmbed()
			.setDescription(`> ${wish}\n<@${interaction.user.id}> ${desc}`)
			.setTitle('Coin Flip')
			.setThumbnail(img)
			.setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })})
			.setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ] });
    }
}

module.exports = {
    CoinFlipCommand
};