const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const NowPlayingCommand = require('../../Functions/lastfm/nowPlaying.js')
const TopTracksCommand = require('../../Functions/lastfm/topTracks.js')
const TopArtistsCommand = require('../../Functions/lastfm/topArtists.js')
const Set = require('../../Functions/lastfm/set.js')
const RecentTracks = require('../../Functions/lastfm/recentTracks.js')
const WhoKnows = require('../../Functions/lastfm/whoKnows.js')
const WhoKnowsTrack = require('../../Functions/lastfm/whoKnowsTrack.js')
const WhoKnowsAlbum = require('../../Functions/lastfm/whoKnowsAlbum.js')
const Playing = require('../../Functions/lastfm/playing.js')
const Crowns = require('../../Functions/lastfm/crowns.js')
const LFEmbed = require('../../Functions/lastfm/embed.js')


class LastFMCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'lastfm',
            description: 'commands that show your music stats--lastfm account required',
            RequiredClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS']
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand(subcommand => 
            subcommand
                .setName('toptracks')
                .setDescription('view your top 10 tracks and their plays.')
                .addStringOption(option => option.setName('period').setDescription('view your top 10 tracks during a specific period of time'))
                .addUserOption(option => option.setName('user').setDescription('view another user\'s top 10 tracks')
            )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('nowplaying')
                .setDescription('view the song you are currently listening to.')
                .addUserOption(option => option.setName('user').setDescription('view the song another user is currently listening to'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('recenttracks')
                .setDescription('view the last 10 songs you\'ve listened to.')
                .addUserOption(option => option.setName('user').setDescription('view the last 10 songs listened by another user'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('topartists')
                .setDescription('view your top 10 artists and their plays.')
                .addStringOption(option => option.setName('period').setDescription('view your top 10 artists during a specific period of time'))
                .addUserOption(option => option.setName('user').setDescription('view another user\'s top 10 artists'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('whoknows')
                .setDescription('check the top 10 listeners to an artist in the server.')
                .addStringOption(option => option.setName('artist').setDescription('the name of the artist you wish to view'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('set')
                .setDescription('connect your last.fm account.')
                .addStringOption(option => option.setName('username').setDescription('your Last.FM username').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('whoknowstrack')
                .setDescription('view the top 10 listeners to a song in the server.')
                .addStringOption(option => option.setName('track').setDescription('the name of the track you wish to view'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('whoknowsalbum')
                .setDescription('view the top 10 listeners to an album in the server.')
                .addStringOption(option => option.setName('album').setDescription('the name of the album you wish to view'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('playing')
                .setDescription('check what people are listening to in the server.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('crowns')
                .setDescription('view how many crowns you have.')
                .addUserOption(option => option.setName('user').setDescription('view another user\'s crowns'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('leaderboard')
                .setDescription('view the top 10 members with the most crowns')
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('embed')
                .setDescription('Choose 1 of 4 tempmlates for your nowplaying embed')
                .addIntegerOption(option => option.setName('id').setDescription('the id of 1 of the 4 templates').setMinValue(1).setMaxValue(4).setRequired(true))
        )
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374', '711965850764312617']
		});
	}

    async chatInputRun(interaction) {
        switch (interaction.options._subcommand) {
            case 'nowplaying':
                await NowPlayingCommand.Get(interaction);
                break;
            case 'toptracks':
                await TopTracksCommand.Get(interaction);
                break;
            case 'topartists':
                await TopArtistsCommand.Get(interaction);
                break;
            case 'set':
                await Set.Get(interaction);
                break;
            case 'recenttracks':
                await RecentTracks.Get(interaction);
                break;
            case 'whoknows':
                await WhoKnows.Get(interaction);
                break;
            case 'whoknowstrack':
                await WhoKnowsTrack.Get(interaction);
                break;
            case 'whoknowsalbum':
                await WhoKnowsAlbum.Get(interaction);
                break;
            case 'playing':
                await Playing.Get(interaction);
                break;
            case 'crowns':
                await Crowns.Get(interaction);
                break;
            case 'leaderboard':
                await Leaderboard.Get(interaction);
                break;
            case 'embed':
                await LFEmbed.Get(interaction);
                break;
        }
    }
}

module.exports = {
    LastFMCommand
};