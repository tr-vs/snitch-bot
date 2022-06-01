const { stringify } = require('querystring');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const LastFMUser = require('../../models/lfuser.js');
const Crown = require('../../models/crowns.js');
const mongoose = require('mongoose');
const _ = require('underscore');

module.exports.Get = async (interaction) => {
    interaction.deferReply();
    
    let artist = interaction.options.getString('artist') ? interaction.options.getString('artist') : null;

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

    if (artist === null) {
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
            const artistName = data.recenttracks.track[0];
            artist = artistName.artist['#text'];
        }
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
                method: 'artist.getinfo',
                artist: artist,
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
    // eslint-disable-next-line no-shadow
    for (let i = 0; i < data2.length; i++) {
        if (data2[i] == undefined || data2[i].artist == undefined || data2[i].artist.length == 0) {
            continue;
        }
        const userplaycount = data2[i].artist.stats.userplaycount;
        if (userplaycount != 0 && userplaycount !== undefined) {
            know1.push({
                member: info[i].member, plays: userplaycount, user: info[i].user,
            });
        }
    }
    if (data2.error == 6) {
        return interaction.followUp('Could not find the artist.');
    }

    if (know1.length === 0) {
        return interaction.followUp(`No one listens to ${artist} here.`);
    }

    for (const element of data2) {
        if (element?.artist !== undefined) {
            artist = element.artist.name;
            break;
        }
    }
    
    know1 = know1.sort((a, b) => parseInt(b.plays) - parseInt(a.plays));
    const know = _.first(_.values(know1), 10);
    const sorted = know[0];
    let description = '';
    // eslint-disable-next-line no-shadow
    for (let i = 0; i < know.length; i++) {
        const name = know[i].member.user.username;
        const plays = know[i].plays;
        // eslint-disable-next-line no-shadow
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
        .setTitle(`Who knows ${artist}?`)
        .setDescription(description)
        .setColor('#2f3136');
    await interaction.followUp({ embeds: [ embed ] });
    try {
        if (sorted.plays >= 50) {
            const crowns = new Crown({
                _id: mongoose.Types.ObjectId(),
                guildID: guild.id,
                userID: sorted.member.id,
                artistName: artist,
                artistPlays: sorted.plays,
                lastfmuser: sorted.user,
            });
            crowns.save()
                .catch(async (err) => {
                    if (err.code == 11000) {
                        const crown = await Crown.findOne({
                            guildID: guild.id,
                            artistName: artist,
                        });

                        if (parseInt(crown.artistPlays) < parseInt(sorted.plays) || !guild.members.cache.has(crown.userID)) {
                            await crown.updateOne({
                                userID: sorted.member.id,
                                artistPlays: sorted.plays,
                                lastfmuser: sorted.user,
                            });
                            crown.save();
                        }
                        if (crown.userID != sorted.member.id) {
                            // eslint-disable-next-line no-shadow
                            const embed = new MessageEmbed().setDescription(`<a:crown:791164532889354270> \`${sorted.member.user.username} now has the crown for ${artist}\``).setColor('ffdf00');
                            return interaction.followUp({ embeds: [ embed ] });
                        }
                    }
                });

        }
    } catch (err) {
        console.log(err);

    }
}