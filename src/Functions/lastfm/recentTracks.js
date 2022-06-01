const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

module.exports.Get = async (interaction) => {
    const userObject = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;

    const settings = await LastFMUser.findOne({
        authorID: userObject.id,
    });

    if (settings == null) {
        const embed = new MessageEmbed()
            .setDescription('`No connected Last.FM account found.`')
            .setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ] });
    }

    const params = stringify({
        method: 'user.getrecenttracks',
        user: settings.user,
        api_key: 'b97a0987d8be2614dae53778e3240bfd',
        format: 'json',
        limit: 10,
    });

    const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json());
    const tag = userObject.tag;
    const authorAv = userObject.displayAvatarURL({ dynamic: true, size: 256 });
    let response = '';
    if (data.error) {
        return interaction.reply('Error fetching info from last.fm.');
    }

    if (data.recenttracks.track[0] == undefined || data.recenttracks.track[0].length == 0) {
        const embed = new MessageEmbed()
            .setDescription(`[Songs have not been detected yet.](https://www.last.fm/user/${settings.user})`)
            .setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ] });
    }
    for (let i = 0; i < 10; i++) {
        if (data.recenttracks.track[i] == undefined || data.recenttracks.track[i].length == 0) continue;
        if (response.length > 2048) continue;
        
        const {
            name: name,
            url: url,
        } = data.recenttracks.track[i];
        const artist = data.recenttracks.track[i].artist['#text'];
        if(i == 9) {
            response += `•「 **${i + 1}** 」一 [${name}](${url}) - **${artist}** \n`;
        } else {
            response += `•「 **0${i + 1}** 」一 [${name}](${url}) - **${artist}** \n`;
        }
    }
    const embed = new MessageEmbed()
        .setAuthor({ name: `Requested by ${tag}`, iconURL: authorAv})                
        .setTitle(`${settings.user}'s Recent Tracks`)
        .setDescription(response)
        .setColor('#2f3136');
    return interaction.reply({ embeds: [ embed ] });
}