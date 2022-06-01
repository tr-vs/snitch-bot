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
    
    let description = `${interaction.guild.members.cache.get(status.juulHolder)} is currently holding the JUUL.`;
    
    if (interaction.guild.members.cache.get(status.juulHolder) == undefined) {
        description = '`The JUUL holder is no longer in the server. Steal or fetch it.`';
    }

    const embed = new MessageEmbed()
        .setTitle('JUUL Status')
        .setDescription(description)
        .setFooter({ text: `The JUUL has been passed ${status.times} times.`, iconURL: 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png' })
        .setColor('2f3136');
    return interaction.reply({ embeds: [ embed ] });
}