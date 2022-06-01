const { stringify } = require('querystring');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const LastFMUser = require('../../models/lfuser.js');
const _ = require('underscore');

module.exports.Get = async (interaction) => {
    interaction.deferReply();
    
    let album = interaction.options.getString('album') ? interaction.options.getString('album') : null;
    let artist;

    try {
        await interaction.guild.members.fetch();
    } catch (err) {
        if (interaction.channel.type === 'dm') {
            const embed = new MessageEmbed()
                .setDescription('`Dawg why u tryna send dat in my DMs...`')
                .setColor('#2f3136');
            return interaction.followUp({ embeds: [ embed ] });
        }
        console.error(err);
    }

    const user1 = await LastFMUser.findOne({
        authorID: interaction.user.id,
    }).lean();

    if (album === null) {
        if (user1 === null) {
            const embed = new MessageEmbed()
                .setDescription('`Please connect your last.fm account. For more help, do +help lf set`')
                .setColor('#2f3136');
            return interaction.followUp({ embeds: [ embed ] });
        }

        const params = stringify({
            method: 'user.getrecenttracks',
            user: user1.user,
            api_key: 'b97a0987d8be2614dae53778e3240bfd',
            format: 'json',
            limit: 1,
        });

        const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r => r.json());

        if (data.error) {
            return interaction.followUp('Error communicating with API.');
        } else {
            if(data.recenttracks.track[0] == undefined || data.recenttracks.track[0].length == 0) {
                console.error(data.recenttracks);
                const embed = new MessageEmbed()
                    .setDescription(`[Songs have not been detected yet.](https://www.last.fm/user/${user1.user})`)
                    .setColor('#2f3136');
                return interaction.followUp({ embeds: [ embed ] });
            }
            const tracks = data.recenttracks.track[0];
            artist = tracks.artist['#text'];
            album = tracks.album['#text'];
        }
    } else {
        const params3 = stringify({
            album,
            api_key: 'b97a0987d8be2614dae53778e3240bfd',
            method: 'album.search',
            limit: 1,
            format: 'json',
        });
        const autocorrect = await fetch(`https://ws.audioscrobbler.com/2.0/?${params3}`).then(r => r.json());
        if (autocorrect.results.albummatches.album[0] == undefined) {
            return interaction.followUp('Could not find the album.');
        }

        album = autocorrect.results.albummatches.album[0].name;
        artist = autocorrect.results.albummatches.album[0].artist;
    }

    const guild = interaction.guild;
    let know1 = [];
    const user = await LastFMUser.find().lean();
    const users = [];
    for (let i = 0; i < user.length; i++) {
        users.push(user[i].authorID);
    }
    let i = 0;
    const request = [];
    const info = [];
    for (const id of users) {
        if(guild.members.cache.has(id)) {
            const stats = guild.members.cache.get(id);
            const params = stringify({
                method: 'album.getinfo',
                artist,
                album,
                username: user[i].user,
                api_key: 'b97a0987d8be2614dae53778e3240bfd',
                format: 'json',
            });
            request.push(`https://ws.audioscrobbler.com/2.0/?${params}`);
            info.push({
                member: stats, user: user[i].user,
            });
        }
        i++;
    }

    const promises = await Promise.allSettled(request.map(u => fetch(u).then(resp => resp.json())));
    const data2 = promises.map(p => p.value);

    for (let i = 0; i < data2.length; i++) {
        if (data2[i] == undefined || data2[i].album == undefined || data2[i].album.length == 0) {
            continue;
        }
        const userplaycount = data2[i].album.userplaycount;
        if (userplaycount != 0 && userplaycount !== undefined) {
            know1.push({
                member: info[i].member, plays: userplaycount, user: info[i].user,
            });
        }
    }

    if (data2.error == 6) {
        return interaction.followUp('Could not find the album.');
    }

    if (know1.length === 0) {
        return interaction.followUp(`No one listens to ${album} by ${artist} here.`);
    }

    know1 = know1.sort((a, b) => parseInt(b.plays) - parseInt(a.plays));
    const know = _.first(_.values(know1), 10);
    let description = '';

    for (let i = 0; i < know.length; i++) {
        const name = know[i].member.user.username;
        const plays = know[i].plays;
        const user = know[i].user;
        if(i == 9) {
            description += `•「 **${i + 1}** 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`;
        } else if (i == 0) {
            description += `•「 👑 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`;
        } else {
            description += `•「 **0${i + 1}** 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`;
        }
    }
    
    const embed = new MessageEmbed()
        .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })})
        .setTitle(`Who knows ${album} by ${artist}?`)
        .setDescription(description)
        .setColor('#2f3136');
    return interaction.followUp({ embeds: [ embed ] });
}