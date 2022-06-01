const { MessageEmbed } = require('discord.js');
const termFunction = require('../term');

module.exports = async (interaction) => {
    const term = await termFunction.setTerm(interaction.user.id, interaction.guildId, interaction.options.getString('term'));

    const embed = new MessageEmbed()
        .setDescription('`Custom term successfully added.`')
        .setColor('#2f3136')
    return interaction.reply({ embeds: [ embed ], ephemeral: true })
}