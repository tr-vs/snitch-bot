const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');
const econ = require('../econ');

module.exports = async (interaction) => {
    const hold = await juul.findOne({
        guildID: interaction.guildId,
        juulHolder: interaction.user.id,
    });

    if (hold == undefined) {
        const embed = new MessageEmbed().setDescription('`You don\'t even have the JUUL...`').setColor('2f3136');
        return interaction.reply({ embeds: [embed]})
    }

    if (hold.hit === true) {
        const embed = new MessageEmbed().setDescription('`Selfish ass mf pass the JUUL on to someone.`').setColor('2f3136');
        return interaction.reply({ embeds: [embed]})
    }

    const [newHits, bonus] = await econ.addHit(interaction.user.id, interaction.guildId);
    
    hold.updateOne({
        hit: true,
    });
    
    let text = '';
    
    if (bonus != 1) {
        text = 'Bonus!';
    }
    
    const embed = new MessageEmbed()
        .setTitle('Hit JUUL')
        .setDescription('`You just hit the JUUL`')
        .setColor('2f3136')
        .setFooter({ text:`You now have ${newHits} hits. ${text}`, iconURL: 'https://cdn.discordapp.com/emojis/777674367719047180.png?v=1'});
    return interaction.reply({ embeds: [embed]})
}