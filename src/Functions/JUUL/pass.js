const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');
const juulBans = require('../../models/juulBans.js');

module.exports = async (interaction) => {
    const userObject = interaction.options.getUser('user');
    const memberObject = await interaction.guild.members.fetch(userObject.id);

    try {
        await interaction.guild.members.fetch();
    } catch (err) {
        console.error(err);
    }

    const pass = juul.findOne({
        guildID: interaction.guildId,
        juulHolder: interaction.user.id,
    });

    const pass2 = juul.findOne({
        guildID: interaction.guildId,
    });

    const bans = juulBans.findOne({
        guildID: interaction.guildId,
        userID: userObject.id,
    });

    if (pass2 == undefined) {
        const embed = new MessageEmbed().setDescription('`There is no JUUL in this server... Get an admin to get one with +JUUL fetch!`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});
    } else if (pass == undefined) {
        const embed = new MessageEmbed().setDescription('`You don\'t even have the JUUL...`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});    
    } else if (bans) {
        const embed = new MessageEmbed().setDescription(`<@${userObject.id}> is banned from getting a hit from the JUUL. Try someone else <:mikeuh:760411543304798208>`).setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});    
    } else if (userObject.id == interaction.user.id) {
        const embed = new MessageEmbed().setDescription('`You can\'t pass it to yourself...`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});
    } else if (userObject.bot) {
        const embed = new MessageEmbed().setDescription('`Nice try LMAO`').setColor('2f3136');
        return interaction.reply({ embeds: [ embed ]});
    }
    
    const count = pass.times + 1;
    
    pass.updateOne({
        juulHolder: userObject.id,
        times: count,
        hit: false,
    });
    
    if (count > pass.record) {
        pass.updateOne({
            record: count,
        });
    }
    
    if (interaction.member.displayName && interaction.member.displayName.includes('[JUUL]')) {
        const str = memberObject.displayName;
        const name = str.replace('[JUUL]', '');
        interaction.member.setNickname(name)
    }

    const name = memberObject.displayName;
    memberObject.setNickname(`[JUUL] ${name}`)
    .catch(_ => {});

    if (count === 420) {
        const embed = new MessageEmbed()
            .setTitle('JUUL Passed')
            .setDescription(`You passed the JUUL to ${interaction.guild.members.cache.get(args.ping.id)}\n420 <a:LETSFUCKINGGO:756955224412782723>`)
            .setColor('2f3136')
            .setFooter({ text: `The JUUL has now been passed ${count} times.`, iconURL: 'https://cdn.discordapp.com/emojis/777674367719047180.png?v=1' });
        return interaction.reply({ embeds: [ embed ]});
    }

    const embed = new MessageEmbed()
        .setTitle('JUUL Passed')
        .setDescription(`You passed the JUUL to ${interaction.guild.members.cache.get(args.ping.id)}`)
        .setColor('2f3136')
        .setFooter({ text: `The JUUL has now been passed ${count} times.`, iconURL: 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png' });
    return interaction.reply({ embeds: [ embed ]});
}