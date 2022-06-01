const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');
const mongoose = require('mongoose');

module.exports = async (interaction) => {
    if(!interaction.member.permissions.has('ADMINISTRATOR')) {
        const embed = new MessageEmbed().setDescription('`You need administrator permissions for this...`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});    
    }

    const pass = juul.findOne({
        guildID: message.guild.id,
    }, (err, passes) => {
        if (err) console.error(err);
        if(!passes) {
            const juuls = new juul({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                juulHolder: message.author.id,
                times: 0,
                record: 0,
                hit: false,
            });

            juuls.save()
                .catch(err => console.error(err));

            const embed = new MessageEmbed().setDescription('`The JUUL has been given to you!`').setColor('2f3136');
            return interaction.reply({ embeds: [ embed ]});    
        }
    });

    try {
        const original = await interaction.guild.members.fetch(pass.juulHolder);

        if (original.nickname && original.nickname.includes('[JUUL]')) {
            const str = original.nickname;
            const name = str.replace('[JUUL]', '');
            original.setNickname(name);
        }

        await pass.updateOne({
            times: 0,
            juulHolder: interaction.user.id,
            hit: false,
        });

        const embed = new MessageEmbed().setDescription('`The JUUL has been reset and given to you!`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});    
    } catch (error) {
        await pass.updateOne({
            times: 0,
            juulHolder: message.author.id,
            hit: false,
        });

        const embed = new MessageEmbed().setDescription('`The JUUL has been reset and given to you!`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});    
    }
}