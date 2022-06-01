const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const ColorThief = require('colorthief');
    
module.exports.Get = async (interaction) => {
	interaction.deferReply(true);
	
	const userObject = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
	
	const settings = await LastFMUser.findOne({
		authorID: userObject.id
	})

	if (settings == null) {
		const embed = new MessageEmbed()
			.setDescription('`No connected Last.FM account found.`')
			.setColor('#2f3136');
		return interaction.followUp({ embeds: [ embed ] });
	}

	const tag = userObject.tag;
	const authorAv = userObject.displayAvatarURL({ dynamic: true, size: 256 });
	let downEmote = '';
	let upEmote = '';

	if (settings.downEmote === undefined) {
		downEmote = '749536550261358613'
	} else {
		downEmote = settings.downEmote
	}
	if (settings.upEmote === undefined) {
		upEmote = '775156840652603412'
	} else {
		upEmote = settings.upEmote
	}

	const params = stringify({
		method: 'user.getrecenttracks',
		user: settings.user,
		api_key: 'b97a0987d8be2614dae53778e3240bfd',
		format: 'json',
		limit: 1,
	});

	const result = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json().then(async function(data) {
		if (data.error) {
			const embed = new MessageEmbed()
				.setDescription('`Error fetching info from last.fm`')
				.setColor('#2f3136');
			return interaction.followUp({ embeds: [ embed ] });
		}

		if(data.recenttracks.track[0] == undefined) {
			const embed = new MessageEmbed()
				.setDescription(`[Songs have not been detected.](https://www.last.fm/user/${settings.user})`)
				.setColor('#2f3136');
			return interaction.followUp({ embeds: [ embed ] });
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
			color = interaction.member.displayHexColor;
		}

		const numformat = n => {
			if (n < 1e3) return n;
			if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
			if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
			if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
			if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
		};

		if (settings.embed === undefined || settings.embed === 1) {
			const params2 = stringify({
				method: 'track.getInfo',
				track: name,
				artist: artist,
				username: settings.user,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				format: 'json',
			});

			const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());

			if(final.track == undefined || final.track.userplaycount == undefined || album === undefined) {
				const embed = new MessageEmbed()
					.setAuthor({ name: `${tag} is currently listening to:`, iconURL: authorAv})
					.addFields(
						{ name:'Name:', value: `[${name}](${trackurl})`, inline: true },
						{ name:'Artist:', value: `[${artist}](${artisturl})`, inline: true },
					)
					.setThumbnail(pic)
					.setColor('#2f3136');
				interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(int => {
					int.react(upEmote).catch(async err => {
						int.react('❌');
						await settings.updateOne({
							upEmote: '775156840652603412',
							downEmote: '749536550261358613'
						});	
						return;
					}).then(int.react(downEmote).catch(async err => {
						int.react('❌');	
						await settings.updateOne({
							upEmote: '775156840652603412',
							downEmote: '749536550261358613'
						});	
					}));
				});
				return;
			}

			const playCount = final.track.userplaycount;
			
			const embed = new MessageEmbed()
				.setAuthor({ name: `${tag} is currently listening to:`, iconURL: authorAv})
				.addFields(
					{ name:'Name:', value: `[${name}](${trackurl})`, inline: true },
					{ name:'Artist:', value: `[${artist}](${artisturl})`, inline: true },
				)
				.setThumbnail(pic)
				.setColor('#2f3136')
				.setFooter({ text: `Album: ${album} | Playcount: ${playCount}`});
			interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
		}

		if (settings.embed === 2) {
			const params2 = stringify({
				method: 'user.getInfo',
				track: name,
				artist: artist,
				username: settings.user,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				format: 'json',
			});
			const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());
			let pfp;
			if (final.user !== undefined) {
				pfp = final.user.image[2]['#text'];
			} else if (final.user === undefined) {
				pfp = userOBJ.displayAvatarURL({ dynamic: true });
			}
			const embed = new MessageEmbed()
				.setDescription(`**Track**\n${name}\n**Artist**\n${artist}`)
				.setColor(interaction.member.displayHexColor);
			if (pfp !== '') embed.setThumbnail(pfp.slice(0, -4) + '.gif');
			interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
		}

		if (settings.embed === 3) {
			const request = [];
			const params2 = stringify({
				method: 'track.getInfo',
				track: name,
				artist: artist,
				username: settings.user,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				format: 'json',
			});
			request.push(`https://ws.audioscrobbler.com/2.0/?${params2}`);
			const params3 = stringify({
				method: 'artist.getInfo',
				artist: artist,
				username: settings.user,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				format: 'json',
			});
			
			request.push(`https://ws.audioscrobbler.com/2.0/?${params3}`);
			const final = await Promise.all(request.map(u => fetch(u).then(resp => resp.json())));
			
			if(final[0].track?.userplaycount == undefined || final[1].artist?.stats.userplaycount == undefined) {
				const embed = new MessageEmbed()
					.setAuthor({ name: `${settings.user}`, iconURL: authorAv})
					.setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})\non [${album}](${albumurl})`)
					.setColor(color)
					.setThumbnail(pic);
				interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
					.setAuthor({ name: `${settings.user}`, iconURL: authorAv })
					.setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})`)
					.setColor(color)
					.setThumbnail(pic);
				interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
				.setAuthor({ name: `${settings.user}`, iconURL: authorAv })
				.setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})\non [${album}](${albumurl})`)
				.setFooter({ text: `${playCount}x・${artistPlays}`})
				.setColor(color)
				.setThumbnail(pic);
			interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
		}
		
		if (settings.embed === 4) {
			const params2 = stringify({
				method: 'track.getInfo',
				track: name,
				artist: artist,
				username: settings.user,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				format: 'json',
			});
			// eslint-disable-next-line no-shadow
			const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());

			if(final.track == undefined || final.track.userplaycount == undefined) {
				const embed = new MessageEmbed()
					.setAuthor({ name: `${settings.user}`, iconURL: authorAv })
					.setDescription(`[${name}](${trackurl})\n> **artist:** [${artist}](${artisturl})\n> **album:** [${album}](${albumurl})`)
					.setColor(color)
					.setThumbnail(pic);
				interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
			const userplayCount = final.track.userplaycount;
			const playcount = numformat(final.track.playcount);

			if (album === undefined) {
				const embed = new MessageEmbed()
					.setAuthor({ name: `${settings.user}`, iconURL: authorAv})
					.setDescription(`[${name}](${trackurl})\n> **artist:** [${artist}](${artisturl})`)
					.setColor(color)
					.setThumbnail(pic);
				interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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

			const embed = new MessageEmbed()
				.setAuthor({ name: `${settings.user}`, iconURL: authorAv})
				.setDescription(`[${name}](${trackurl})\n> **artist:** [${artist}](${artisturl})\n> **album:** [${album}](${albumurl})`)
				.setFooter({ text: `${userplayCount} plays・${playcount} total scrobbles`})
				.setColor(color)
				.setThumbnail(pic);
			interaction.followUp({ embeds: [ embed ], fetchReply: true }).then(msg => {
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
		}
	}));
}

