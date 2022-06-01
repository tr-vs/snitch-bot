const { Listener } = require('@sapphire/framework');
const { MessageSelectMenu } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const ColorThief = require('colorthief');

class MessageListener extends Listener {
    constructor(context, options) {
    super(context, {
        ...options,
        once: true,
        event: 'messageCreate'
    });
    }

    async run(message) {
        if (message.content === '<a:jerryvibe:795717643750342656>') {
            const upEmote = '👍';
            const downEmote = '👎';
            const authorAv = message.author.displayAvatarURL({ dynamic: true, size: 256 });

            const params = stringify({
                method: 'user.getrecenttracks',
                user: 'trvs_',
                api_key: 'b97a0987d8be2614dae53778e3240bfd',
                format: 'json',
                limit: 1,
            });
    
            const result = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json().then(async function(data) {
                if (data.error) {
                    const embed = new MessageEmbed()
                        .setDescription('`Error fetching info from last.fm`')
                        .setColor('#2f3136');
                    return message.channel.send({ embeds: [ embed ] });
                }
    
                if(data.recenttracks.track[0] == undefined) {
                    const embed = new MessageEmbed()
                        .setDescription(`[Songs have not been detected.](https://www.last.fm/user/trvs_)`)
                        .setColor('#2f3136');
                    return message.channel.send({ embeds: [ embed ] });
                }
    
                const name = data.recenttracks.track[0].name;
                const artist = data.recenttracks.track[0].artist['#text'];
                const pic = data.recenttracks.track[0].image[2]['#text'];
                const album = data.recenttracks.track[0].album['#text'];
                const artisturl = `https://www.last.fm/music/${encodeURIComponent(artist)}`;
                const trackurl = data.recenttracks.track[0].url;
                const albumurl = `https://www.last.fm/music/${encodeURIComponent(artist)}/${encodeURIComponent(album)}`;
    
                let color = '';
                try {
                    color = await ColorThief.getColor(pic);
                } catch {
                    color = message.member.displayHexColor;
                }
    
                const numformat = n => {
                    if (n < 1e3) return n;
                    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
                    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
                    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
                    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
                };
    
                const request = [];
                const params2 = stringify({
                    method: 'track.getInfo',
                    track: name,
                    artist: artist,
                    username: 'trvs_',
                    api_key: 'b97a0987d8be2614dae53778e3240bfd',
                    format: 'json',
                });
                request.push(`https://ws.audioscrobbler.com/2.0/?${params2}`);
                const params3 = stringify({
                    method: 'artist.getInfo',
                    artist: artist,
                    username: 'trvs_',
                    api_key: 'b97a0987d8be2614dae53778e3240bfd',
                    format: 'json',
                });
                
                request.push(`https://ws.audioscrobbler.com/2.0/?${params3}`);
                const final = await Promise.all(request.map(u => fetch(u).then(resp => resp.json())));
                
                if(final[0].track?.userplaycount == undefined || final[1].artist?.stats.userplaycount == undefined) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: `trvs_`, iconURL: authorAv})
                        .setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})\non [${album}](${albumurl})`)
                        .setColor(color)
                        .setThumbnail(pic);
                    message.channel.send({ embeds: [ embed ], fetchReply: true }).then(msg => {
                        msg.react(upEmote).catch(async err => {
                            msg.react('❌');
                            await settings.updateOne({
                                upEmote: '775156840652603412',
                                downEmote: '749536550261358613'
                            });	
                            return;
                        }).then(msg.react(downEmote).catch(async err => {
                            msg.react('❌');	
                            await settings.updateOne({
                                upEmote: '775156840652603412',
                                downEmote: '749536550261358613'
                            });	
                        }));
                    });
                    return;
                }

                if(album === undefined) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: `trvs_`, iconURL: authorAv })
                        .setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})`)
                        .setColor(color)
                        .setThumbnail(pic);
                    message.channel.send({ embeds: [ embed ], fetchReply: true }).then(msg => {
                        msg.react(upEmote).catch(async err => {
                            msg.react('❌');
                            await settings.updateOne({
                                upEmote: '775156840652603412',
                                downEmote: '749536550261358613'
                            });	
                            return;
                        }).then(msg.react(downEmote).catch(async err => {
                            msg.react('❌');	
                            await settings.updateOne({
                                upEmote: '775156840652603412',
                                downEmote: '749536550261358613'
                            });	
                        }));
                    });
                    return;
                }

                const playCount = final[0].track.userplaycount;
                const artistPlays = final[1].artist.stats.userplaycount;
                
                const embed = new MessageEmbed()
                    .setAuthor({ name: `trvs_`, iconURL: authorAv })
                    .setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})\non [${album}](${albumurl})`)
                    .setFooter({ text: `${playCount}x・${artistPlays}`})
                    .setColor(color)
                    .setThumbnail(pic);
                message.channel.send({ embeds: [ embed ], fetchReply: true }).then(msg => {
                    msg.react(upEmote).catch(async err => {
                        msg.react('❌');
                        await settings.updateOne({
                            upEmote: '775156840652603412',
                            downEmote: '749536550261358613'
                        });	
                        return;
                    }).then(msg.react(downEmote).catch(async err => {
                        msg.react('❌');	
                        await settings.updateOne({
                            upEmote: '775156840652603412',
                            downEmote: '749536550261358613'
                        });	
                    }));
                });
            }));
        }
    }
}

module.exports = {
    MessageListener
};