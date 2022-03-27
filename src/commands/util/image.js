const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const gis = require('g-i-s');
const Guild = require('../../models/guild');

class BannerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'image',
            description: 'Search for an image.',
            requiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addStringOption(option => option.setName('query').setDescription('whatever you want an image of').setRequired(true))
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['957515787378233384']
		});
	}

    async chatInputRun(interaction) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');
        
        if (interaction.channel.type !== "DM") {
            const role = Guild.findOne({
                guildID: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        _id: mongoose.Types.ObjectId(),
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        sniperID: '1',
                    })
    
                    newGuild.save()
                    .catch(err => console.error(err))
    
                    const embed = new MessageEmbed()
                        .setDescription('`This server was not in my database. Please try again.`')
                        .setColor('#2f3136');
                    return interaction.reply({ embeds: [ embed ] });
                }
            });
    
            if (role == null) {
                return
            }
    
            if (role.sniperID != '1' && !interaction.member.roles.cache.has(role.sniperID) && !interaction.member.permissions.has('MANAGE_MESSAGES')) {
                const embed = new MessageEmbed()
                    .setDescription(`You are missing the ${interaction.guild.roles.cache.get(role.sniperID)} role.`)
                    .setColor('#2f3136');
                return interaction.editReply({ embeds: [ embed ] });
            }
        }

        let queryString = '';
        if (interaction.channel.nsfw) {
            queryString = '&safe=images';
        } else {
            queryString = '&safe=active';
        }

        const search = {
            searchTerm: query,
            queryStringAddition: queryString,
        };

        let page = 1;

        gis(search, logResults);

        function logResults(_, results) {
            const pngFilter = [];
            for(let i = 0; i < results.length; i++) {
                pngFilter.push(results[i].url);
            }
            const jpg = '.jpg';
            const jpeg = '.jpeg';
            const gif = '.gif';
            const png = '.png';

            const filters = [jpg, jpeg, png, gif];
            const filtered = pngFilter.filter(link => filters.some(e => link.includes(e)));
            filtered.splice(10);
            if (filtered.length != 0) {
                const embed = new MessageEmbed()
                    .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 256 })})
                    .setTitle('Image Search for ' + query)
                    .setImage(filtered[page - 1])
                    .setColor('#2f3136')
                    .setFooter({text: `Page ${page} of ${filtered.length}`});
                    interaction.editReply({ embeds: [ embed ], fetchReply: true }).then(msg => {
                    msg.react('⏮').then(() => {
                        msg.react('⏭');

                            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏮' && user.id === interaction.user.id;
                            const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏭' && user.id === interaction.user.id;

                            const backwards = msg.createReactionCollector({ filter: backwardsFilter, time: 60000 });
                            const forwards = msg.createReactionCollector({ filter: forwardsFilter, time: 60000 });

                            backwards.on('collect', async (r) => {
                                if (page === 1) return;
                                page--;
                                embed.setImage(filtered[page - 1]);
                                embed.setFooter({ text: `Page ${page} of ${filtered.length}`});
                                msg.edit({ embeds: [ embed ] });
                
                                await r.users.remove(interaction.user.id);
                            });

                            forwards.on('collect', async (r) => {
                                if (page === results.length) return;
                                page++;
                                embed.setImage(filtered[page - 1]);
                                embed.setFooter({ text: `Page ${page} of ${filtered.length}`});
                                msg.edit({ embeds: [ embed ] });
                                await r.users.remove(interaction.user.id);
                            });

                    });
                });
            } else {
                const embed = new MessageEmbed().setDescription('`No results found. (If search was NSFW, try marking the channel as such)`').setColor('2f3136');
                return interaction.editReply({ embeds: [ embed ] })
            }

        }
    }
}

module.exports = {
    BannerCommand
};