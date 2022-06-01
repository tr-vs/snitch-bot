const { MessageEmbed } = require('discord.js');
const Crown = require('../../models/crowns.js');

module.exports.Get = async (interaction) => {
    const crowns = await Crown.find({
        guildID: interaction.guild.id,

    });

    const amounts = new Map();

    crowns.forEach(x => {        
        if (amounts.has(x.userID)) {
            let amount = amounts.get(x.userID);
            amounts.set(x.userID, ++amount);
        } else {
            amounts.set(x.userID, 1);
        }
    });

    let num = 0;

    const entries = [...amounts.entries()].sort(([_, a], [__, b]) => b - a);
    const hasCrowns = entries.findIndex(([userID]) => userID === interaction.user.id);
    const authorPos = hasCrowns !== -1 ? hasCrowns + 1 : null;

    if (entries.length === 0) {
        const embed = new MessageEmbed()
            .setColor('2f3136')
            .setDescription(`\`nobody has any crowns in this server...\``);
        return interaction.reply({ embeds: [ embed ]});
    } else {
        const embed = new MessageEmbed()
        .setTitle(`Crown Leaderboard in ${interaction.guild.name}`)
        .setDescription(
            entries.slice(0, 10)
                .map(([userID, amount]) => {
                    if (num == 9) {
                        return `•「 **${++num}** 」一 <@${userID}> has **${amount}** crowns`;
                    } else {
                        return `•「 **0${++num}** 」一 <@${userID}> has **${amount}** crowns`;
                    }
                })
                .join('\n') + `${authorPos ? `\n\n\`Your rank is: #${authorPos}\`` : ''}`,
        )
		.setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })}) 
        .setColor('#2f3136');
    return interaction.reply({ embeds: [ embed ] })
    }
}