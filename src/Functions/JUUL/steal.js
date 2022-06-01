const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');
const juulBans = require('../../models/juulBans.js');
const econ = require('../econ');

module.exports = async (interaction) => {
    const [hits, steals, menthol, mango, cucumber, creme, fruit] = await econ.getBal(interaction.author.id, interaction.guild.id);
    
    if (steals == 0) {
        const embed = new MessageEmbed().setDescription('`You don\'t have a pair of black airforces... Buy some with +JUUL buy black airforces`').setColor('2f3136');
        return interaction.reply({ embeds: [embed] })
    }

    const check = await juul.findOne({
        guildID: interaction.guildId,
    });

    const bans = await juulBans.findOne({
        guildID: interaction.guildId,
        userID: interaction.user.id,
    });

    if (bans) {
        const embed = new MessageEmbed().setDescription('`What you tryna do? You\'re banned from the JUUL.` <:pointandlaugh:776334813757833257>').setColor('2f3136');
        return interaction.reply({ embeds: [embed] })    
    }

    if (check == undefined) {
        const embed = new MessageEmbed().setDescription('`There is no JUUL in this server... Get an admin to get one with +JUUL fetch!`').setColor('2f3136');
        return interaction.reply({ embeds: [embed] })    
    }

    if (check.juulHolder == interaction.user.id) {
        const embed = new MessageEmbed().setDescription('`You tryna steal it from yourself?`').setColor('2f3136');
        return interaction.reply({ embeds: [embed] })    
    }

    if (await interaction.guild.members.fetch(check.juulHolder) == undefined) {
        const count = check.times + 1;

        check.updateOne({
            juulHolder: interaction.user.id,
            times: count,
            hit: false,
        });

        // eslint-disable-next-line no-shadow
        const steals = await econ.useSteal(interaction.user.id, interaction.guildId);
        
        const embed = new MessageEmbed()
            .setTitle('JUUL Stolen')
            .setDescription(`You stole the JUUL and now have ${steals} pairs of black airforces.`)
            .setColor('2f3136')
            .setFooter({ text: `The JUUL has now been passed ${count} times.`, iconURL: 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png' });
        return interaction.reply({ embeds: [embed] })    
    }

    if (check) {
        const then = new Date(check.updatedAt).getTime();
        const now = new Date().getTime();

        const diffTime = Math.abs(now - then);
        const diffMin = Math.round(diffTime / (1000));
        const og = check.juulHolder;
        
        if (diffMin <= 600) {
            const diff = 600 - diffMin;
            const mins = Math.floor(diff / 60);
            const secs = diff % 60;
            
            if (mins == 0) {
                const embed = new MessageEmbed().setDescription(`${interaction.guild.members.cache.get(og)} must have the JUUL for ${secs} more secs before you can steal it from them.`).setColor('2f3136');
                return interaction.reply({ embeds: [embed] })
            }
            
            const embed = new MessageEmbed().setDescription(`${interaction.guild.members.cache.get(og)} must have the JUUL for ${mins} mins and ${secs} secs more before you can steal it from them.`).setColor('2f3136');
            return interaction.reply({ embeds: [embed] })
        } else if (diffMin <= 240 && fruit > 0) {
            const diff = 240 - diffMin;
            const mins = Math.floor(diff / 60);
            const secs = diff % 60;

            if (mins == 0) {
                const embed = new MessageEmbed().setDescription(`${interaction.guild.members.cache.get(og)} must have the JUUL for ${secs} more secs before you can steal it from them.`).setColor('2f3136');
                return interaction.reply({ embeds: [embed] })
            }

            const embed = new MessageEmbed().setDescription(`${interaction.guild.members.cache.get(og)} must have the JUUL for ${mins} mins and ${secs} secs more before you can steal it from them.`).setColor('2f3136');
            return interaction.reply({ embeds: [embed] })
        }
        const count = check.times + 1;

        check.updateOne({
            juulHolder: interaction.user.id,
            times: count,
            hit: false,
        });

        const steals = await econ.useSteal(interaction.user.id, interaction.guildId);
        const original = await interaction.guild.members.fetch(og);

        if (original.nickname && original.nickname.includes('[JUUL]')) {
            const str = original.nickname;
            const name = str.replace('[JUUL]', '');
            original.setNickname(name);
        }

        const embed = new MessageEmbed()
            .setTitle('JUUL Stolen')
            .setDescription(`You stole the JUUL from ${await interaction.guild.members.fetch(og)}\nand now have ${steals} pairs of black airforces.`)
            .setColor('2f3136')
            .setFooter({ text: `The JUUL has now been passed ${count} times.`, iconURL: 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png'});
        interaction.reply({ embeds: [embed] });
    }
}