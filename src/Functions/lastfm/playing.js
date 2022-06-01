const { stringify } = require('querystring');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const LastFMUser = require('../../models/lfuser.js');
const pagination = require('../../util/pagination.js')

module.exports.Get = async (interaction) => {
    interaction.deferReply();

    try {
        await interaction.guild.members.fetch();
    } catch (err) {
        console.error(err);
    }

    const user = await LastFMUser.find().lean();
    const users = [];
    for (let i = 0; i < user.length; i++) {
        users.push(user[i].authorID);
    }
    var i = 0;
    const request = [];
    const info = [];
    for (const id of users) {
        if(interaction.guild.members.cache.has(id)) {
            const stats = interaction.guild.members.cache.get(id);
            const params = stringify({
                method: 'user.getrecenttracks',
                user: user[i].user,
                api_key: 'b97a0987d8be2614dae53778e3240bfd',
                format: 'json',
                limit: 1,
                from: Math.floor(Date.now() / 1000),
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
    const know1 = [];
    // eslint-disable-next-line no-shadow
    for (let i = 0; i < data2.length; i++) {
        if(data2[i].recenttracks !== undefined) {
            if (data2[i].recenttracks.track !== undefined && data2[i].recenttracks.track.length != 0) {
                know1.push({
                    member: info[i].member, artist: data2[i].recenttracks.track.artist['#text'], track: data2[i].recenttracks.track.name, url: data2[i].recenttracks.track.url,
                });
            }
        }
    }
    if (data2.error) {
        return message.util.send('There was an error communicating with the API. Try again.');
    }
    const first = [];
    const second = [];
    const description = [];
    if (know1.length > 0) {
        // eslint-disable-next-line no-shadow
        for (let i = 0; i < know1.length; i += 10) {
            first.push(know1.slice(i, i + 10));
        }
        for (let x = 0; x < first.length; x += 1) {
            if (first[x] == undefined) continue;
            // eslint-disable-next-line no-shadow
            for (let i = 0; i < 10; i += 1) {
                if (first[x][i] == undefined) continue;
                let string = '';
                const name = first[x][i].member.user.username;
                const artist = first[x][i].artist;
                const track = first[x][i].track;
                const url = first[x][i].url;
                string += `\`${name}\` 一 [${track} - ${artist}](${url})\n`;
                second.push(string);
            }

        }
        if(second.length > 0) {
            for (let t = 0; t < second.length; t += 10) {
                description.push(second.slice(t, t + 10));
            }
        }
        
        let embeds = [];
        
        for (let i = 0 ; i<description.length; i++) {
            let desc = '';

            description[i].map(x => {
                desc += x;
            })

            const embed = new MessageEmbed()
				.setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })}) 
				.setTitle(`Currently Playing in ${interaction.guild.name}`)
				.setColor('#2f3136')
				.setFooter({ text: `Page ${i+1} of ${description.length}` })
                .setDescription(desc)
            embeds.push(embed);
        }

        pagination(interaction, embeds);
    } else {
        const embed = new MessageEmbed()
            .setColor('2f3136')
            .setDescription('`Nobody is listening to anything in the server.`');
        return interaction.followUp({ embeds: [ embed ] });
    }
}