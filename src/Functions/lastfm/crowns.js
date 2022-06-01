const { MessageEmbed } = require('discord.js');
const Crown = require('../../models/crowns.js');
const pagination = require('../../util/pagination.js')

module.exports.Get = async (interaction) => {
    let page = 1;
    const first = [];
    const second = [];
    const description = [];

	const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;

    const crowns = await Crown.find({
        guildID: interaction.guild.id,
        userID: user.id,
    }).sort([['artistPlays', 'descending']]).lean();

    if (crowns.length > 0) {
        let place = 1;

        const footer = `${user.username} has ${crowns.length} crowns in ${interaction.guild.name}`;

        for (let i = 0; i < crowns.length; i += 10) {
            first.push(crowns.slice(i, i + 10));
        }

        for (let x = 0; x < first.length; x += 1) {
            if (first[x] == undefined) continue;
            for (let i = 0; i < 10; i += 1) {
                if (first[x][i] == undefined) continue;
                let string = '';
                const name = first[x][i].artistName;
                const plays = first[x][i].artistPlays;
                const url = `https://www.last.fm/music/${encodeURIComponent(name)}`;
                if (place < 10) {
                    string += `•「 **0${place}** 」一 [${name}](${url}) (${plays} plays)\n`;
                } else {
                    string += `•「 **${place}** 」一 [${name}](${url}) (${plays} plays)\n`;
                }
                if (plays > 0) {
                    second.push(string);
                }
                place += 1;
            }
        }

        if (second.length > 0) {
            for (let t = 0; t < second.length; t += 10) {
                description.push(second.slice(t, t + 10));
            }
        }

        let embeds = [];

        for (let i = 0; i < description.length; i++) {
            let desc = '';

            description[i].map(x => {
                desc += x;
            })

            const embed = new MessageEmbed()
                .setTitle(`${user.username}'s crowns in ${interaction.guild.name}`)
                .setDescription(desc)
				.setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })}) 
                .setColor('#2f3136')
                .setFooter({ text: `${footer} | Page ${page} of ${description.length}`})
            embeds.push(embed);
        }
        
        pagination(interaction, embeds);
    } else {
        const embed = new MessageEmbed()
            .setColor('2f3136')
            .setDescription(`\`${user.user.username} does not have any crowns in this server!\``);
        return interaction.reply({ embeds: [ embed ]});
    }
}