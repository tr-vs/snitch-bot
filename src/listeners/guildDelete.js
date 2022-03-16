const { Listener } = require('@sapphire/framework');
const Guild = require('../models/guild');
const Crown = require('../models/crowns');
const Disable = require('../models/disables')

class ReadyListener extends Listener {
    constructor(context, options) {
    super(context, {
        ...options,
    });
    }

    async run(guild) {
        Guild.findOneAndDelete({
			guildID: guild.id,

		}, (err) => {
			if(err) console.error(err);
			console.log(`Removed from a server with ${guild.memberCount} members.`);
		});

        const crowns = Crown.deleteMany({
			guildID: guild.id,
		}, (err) => {
			if(err) console.error(err);
		});
		const disables = Disable.deleteMany({
			guildID: guild.id,
		}, (err) => {
			if(err) console.error(err);
		});
    }
}

module.exports = {
    ReadyListener
};