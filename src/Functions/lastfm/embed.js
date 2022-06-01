const { MessageEmbed } = require('discord.js');
const LastFMUser = require('../../models/lfuser.js');

module.exports.Get = async (interaction) => {
    const template = interaction.options.getInteger('id');

    const settings = LastFMUser.findOne({
        authorID: interaction.user.id,
    }, (err, lfu) => {
        if (err) console.error(err);
        if(!lfu) {
            const embed = new MessageEmbed()
                .setDescription('`You don\'t even have a connected Last.FM account...`')
                .setColor('#2f3136');
            return interaction.reply({ embeds: [ embed ] });
        }
    });

    if (settings == null) return;

    settings.updateOne({
        embed: template,
    });

    const embed = new MessageEmbed()
        .setDescription('`Embed template successfully updated.`')
        .setColor('#2f3136');
    return interaction.reply({ embeds: [ embed ] });
}