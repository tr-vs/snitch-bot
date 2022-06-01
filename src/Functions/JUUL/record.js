const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');

module.exports = async (interaction) => {
    const status = await juul.findOne({
        guildID: interaction.guildId,
    });

    if (status == undefined) {
        const embed = new MessageEmbed().setDescription('`There is no JUUL in this server... Get an admin to get one with +JUUL fetch!`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ] });
    }

    const embed = new MessageEmbed()
        .setTitle('JUUL Status')
        .setDescription(`\`The record in this server is ${status.record} passes.\``)
        .setFooter({ text: `The current number of passes is ${status.times}`, iconURL: 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png' })
        .setColor('2f3136');
    return interaction.reply({ embeds: [ embed ] });
}