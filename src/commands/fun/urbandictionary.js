const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

class UrbanDictionaryCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'urbandictionary',
            description: 'Provides a defintion from Urban Dictionary for a word.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addStringOption(option => option.setName('word').setDescription('the word you want the definition of').setRequired(true))
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['955250389672935424']
		});
	}

    async chatInputRun(interaction) {
        const word = interaction.options.getString('word');
        const params = stringify({
			term: word
		});
        const result = await fetch(`https://api.urbandictionary.com/v0/define?${params}`).then(r=> r.json());
		if(result?.list?.[0] == undefined) {
			const embed = new MessageEmbed()
				.setDescription('`No definition available for the term. :(`')
				.setColor('#2f3136');
            return interaction.reply({ embeds: [ embed ] });
		}
		const def = result.list[0].definition;
		let def2 = def.replace(/[[\]']+/g, '');
		if (def2.length > 1024) {
			def2 = def2.slice(0, 1000);
			def2 += '...';
		}
		const embed = new MessageEmbed()
			.setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 }) })
			.addFields(
				{ name:'**Term:**', value: `\`${word}\``, inline: false },
				{ name:'**Definition:**', value: `\`${def2}\``, inline: true },
			)
			.setColor('#2f3136')
			.setTimestamp()
			.setFooter({ text: 'Definition from Urban Dictionary', iconURL:'https://images-ext-1.discordapp.net/external/fMEapbYL4UK80HaDtJk94HmiTqCBUfvBG4UruwuGIuk/https/slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg'});
        return interaction.reply({ embeds: [ embed ] });
    }
}

module.exports = {
    UrbanDictionaryCommand
};