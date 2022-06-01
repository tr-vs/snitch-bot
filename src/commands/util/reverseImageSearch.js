const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

class ReverseImageSearchCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'reverseimagesearch',
            description: 'Reverse image search a user\'s pfp.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addUserOption(option => option.setName('user').setDescription('whoever\'s pfp you want to reverse image search'))
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['957499442490142740']
		});
	}

    async chatInputRun(interaction) {
        await interaction.deferReply();
        const av = interaction.options.getUser('user') ? interaction.options.getUser('user').displayAvatarURL({ format: 'png', dynamic: true }) : interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        const url = `https://www.google.com/searchbyimage?image_url=${av}`;
        const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
        };

        // Fetch result and parse it as JSON
        const body = await fetch(url, { headers });
        const result = await body.text();
        const $ = cheerio.load(result);
        const urlList = [];
        const titleList = [];
        const descriptionList = [];
        const arrowList = [];

        $('.yuRUbf a').each((i, url) => {

            const urls = $(url).attr('href');
            const titles = $(url).find('h3').text().trim().replace(/\s\s+/g, '');
            if (urls !== "#" && !urls.startsWith('/search?q=related:') && !urls.startsWith('https://webcache.googleusercontent.com/search?q=cache') && !urls.startsWith('https://translate.google.com/translate')) {
                titleList.push(titles);
                urlList.push(urls);
            }
        });

        $('.lyLwlc').each((x, url) => {
            const description = $(url).text();
            descriptionList.push(description);
        });
        $('.NJjxre').each((x, url) => {
            const arrow = $(url).text().trim().replace(/https:\/\//i, '');
            arrowList.push(arrow);
        });

        const guess = $('.r5a77d').text().replace(/possible related search:/i, '');
        const finalURL = urlList.slice(2, 5);
        const finalTitle = titleList.slice(2, 5);
        const finalArrow = arrowList.slice(2, 5);
        const finalDescription = descriptionList.slice(2, 5);
        if (finalURL.length === 0) {
            const embed = new MessageEmbed()
                .setDescription(`[No Similar Images Found on Google](${url})`)
                .setColor('2f3136');
            return interaction.editReply({ embeds: [ embed ] });
        }
        const embed = new MessageEmbed()
            .setTitle('Reverse Image Search')
            .setThumbnail(av)
            .setFooter({ text: `Possible search for: '${guess}'`, iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png' })
            .setURL(url)
            .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })})
            .setColor('2f3136');
        finalArrow.forEach((arrow, i) => {
            embed.addField(`${arrow}`, `**[${finalTitle[i]}](${finalURL[i]})**\n${finalDescription[i]}`);
        });
        return await interaction.editReply({ embeds: [ embed ] });
    }
}

module.exports = {
    ReverseImageSearchCommand
};