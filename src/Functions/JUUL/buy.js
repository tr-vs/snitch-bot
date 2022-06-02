const { MessageEmbed } = require('discord.js');
const econ = require('../econ');

module.exports = async (interaction) => {
    let desc = '';
    let footer = '';

    const item = interaction.options.getString('item');
    const quantity = interaction.options.getInteger('quantity') ? interaction.options.getInteger('quantity') : 1;

    if (item == 'mango') {
        [desc, footer] = await econ.buyMango(interaction.user.id, interaction.guildId);
    } else if (item == 'menthol') {
        [desc, footer] = await econ.buyMenthol(interaction.user.id, interaction.guildId);
    } else if (item == 'cucumber') {
        [desc, footer] = await econ.buyCucumber(interaction.user.id, interaction.guildId);
    } else if (item == 'creme') {
        [desc, footer] = await econ.buyCreme(interaction.user.id, interaction.guildId);
    } else if (item == 'fruit') {
        [desc, footer] = await econ.buyFruit(interaction.user.id, interaction.guildId);
    } else if (item == 'black airforces') {
        [desc, footer] = await econ.buySteal(interaction.user.id, interaction.guildId, quantity);
    }

    const embed = new MessageEmbed()
        .setDescription(`\`${desc}\``)
        .setColor('2f3136')
        .setFooter({ text: `${footer}` });
    return interaction.reply({ embeds: [ embed ] })
}