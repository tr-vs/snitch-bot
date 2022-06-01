const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const juulBans = require('../../models/juulBans.js');

module.exports = async (interaction) => {
    const userObject = interaction.options.getUser('user');
    
    const ban = await juulBans.findOne({
        guildID: interaction.guildId,
        userID: userObject.id,
    }, (err, bans) => {
        if(err) console.err(err);

        if(!bans) {
            const newBan = new juulBans({
                _id: mongoose.Types.ObjectId(),
                guildID: interaction.guildId,
                userID: userObject.id,
            });

            newBan.save().catch(err => console.error(err));

            const embed = new MessageEmbed().setDescription(`${await interaction.guild.members.fetch(userObject.id)} has been banned from the JUUL. <:pointandlaugh:776334813757833257>`).setColor('2f3136');
            return interaction.reply({ embeds: [embed]})
        }
    });

    if (ban) {
        const embed = new MessageEmbed().setDescription(`${await interaction.guild.members.fetch(userObject.id)} has already been banned from the JUUL. You can unban with +JUUL unban <member>.`).setColor('2f3136');
        return interaction.reply({ embeds: [embed]})
    }
}