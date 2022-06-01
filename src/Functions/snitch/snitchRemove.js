const { MessageEmbed } = require('discord.js');
const termFunction = require('../term');

module.exports = async (interaction) => {
    const term = await termFunction.removeTerm(interaction.user.id, interaction.guildId, interaction.options.getString('term'));

    if (term > 0) {
        const embed = new MessageEmbed()
            .setDescription('`Custom term successfully removed.`')
            .setColor('#2f3136')
        return interaction.reply({ embeds: [ embed ], ephemeral: true })
    } else {
        const embed = new MessageEmbed()
            .setDescription('`Could not find the term to remove.`')
            .setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ], ephemeral: true })
    }
}