const { MessageEmbed } = require('discord.js');
const termFunction = require('../term');

module.exports = async (interaction) => {
    const list = await termFunction.getUserTerm(interaction.user.id, interaction.guildId);
    let description = list.join(', ');

    if (list.length !== 0) {
        const embed = new MessageEmbed()
            .setTitle('List of Terms')
            .setDescription(`\`${description}\``)
            .setColor('#2f3136');
            return interaction.reply({ embeds: [ embed ], ephemeral: true })
    } else {
        const embed = new MessageEmbed()
            .setDescription(`\`No terms found.\``)
            .setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ], ephemeral: true })
    }
}