const { MessageEmbed } = require('discord.js');
const inventory = require('../../models/userInventory.js');

module.exports = async (interaction) => {
    let page = 1;
    const first = [];
    const second = [];
    const description = [];
    const list = inventory.find({
        guildID: interaction.guild.id,
    }).sort([['hits', 'descending']]).lean();

    if (list.length == 0 || list == undefined) {
        const embed = new MessageEmbed()
            .setDescription('`No one has any hits in the server!`')
            .setColor('2f3136');
        return interaction.reply({ embeds : [ embed ] });
    }

    if(list.length > 0) {
        for (let i = 0; i < list.length; i += 10) {
            first.push(list.slice(i, i + 10));
        }
    }

    let place = 1;

    for (let x = 0; x < first.length; x += 1) {
        if (first[x] == undefined) continue;
        
        let emote = '';
        
        for (let i = 0; i < 10; i += 1) {
            if (first[x][i] == undefined) continue;
            
            let string = '';
            
            if (first[x][i].mango != 0) {
                emote = '<:mango:780309627412676608>';
            } else if (first[x][i].menthol != 0) {
                emote = '<:menthol:780310676374552666>';
            } else if (first[x][i].cucumber != 0) {
                emote = '<:cucumber:780309343299174411>';
            } else if (first[x][i].creme != 0) {
                emote = '<:creme:780310990260535326>';
            } else if (first[x][i].fruit != 0) {
                emote = '<:fruit:780310301357637662>';
            } else {
                emote = '';
            }
            
            const userID = first[x][i].userID;
            const amount = first[x][i].hits;
            
            if (place < 10) {
                string += `•「 **0${place}** 」一 ${emote} <@${userID}> has **${amount}** hits`;
            } else {
                string += `•「 **${place}** 」一 ${emote} <@${userID}> has **${amount}** hits`;
            }
            
            if (amount > 0) {
                second.push(string);
            }
            
            place += 1;
        }
    }
    if(second.length > 0) {
        for (let t = 0; t < second.length; t += 10) {
            description.push(second.slice(t, t + 10));
        }
    }

    if (description === undefined || description.length == 0) {
        const embed = new MessageEmbed()
            .setDescription('`No one has any hits in the server!`')
            .setColor('2f3136');
        return interaction.reply({ embeds : [ embed ] });
    }

    const embed = new MessageEmbed()
        .setTitle(`Juul Hit Leaderboard in ${interaction.guild.name}`)
        .setDescription(description[0])
        .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })})
        .setColor('#2f3136')
        .setFooter({ text: `Page ${page} of ${description.length}`});
    return interaction.reply({ embeds: [ embed ]})
}