const { MessageEmbed } = require('discord.js');
const econ = require('../econ');

module.exports = async (interaction) => {
    const [hits] = await econ.getBal(interaction.user.id, interaction.guildId);
    const [newHits, cost] = await econ.shop(interaction.user.id, interaction.guildId);
    
    const embed = new MessageEmbed()
        .setAuthor({ name: `JUUL Shop | Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })} )
        .addFields(
            { name: 'Upgrade Path:', value: `${newHits}`, inline: true },
            { name: 'Items:', value: `<:blackairforces:780497808762994688> **Black Airforces** | Ability: Steal the JUUL.\n${cost}`, inline: false },
        )
        .setThumbnail('https://www.vippng.com/png/full/511-5119547_what-is-a-juul-juul-transparent-background.png')
        .setFooter({ text: `Your balance: ${hits} hits`})
        .setColor('2f3136');
    interaction.reply({ embeds: [embed] })
}