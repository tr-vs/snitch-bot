const { Listener } = require('@sapphire/framework');
const mongoose = require('mongoose');
const Guild = require('../models/guild');

class ReadyListener extends Listener {
    constructor(context, options) {
    super(context, {
        ...options,
    });
    }

    run(guild) {
        const guilds = new Guild({
			_id: mongoose.Types.ObjectId(),
			guildID: guild.id,
			guildName: guild.name,
			sniperID: '1',
		});

		guilds.save().catch(err => console.error(err));

		console.log(`Joined a new server with ${guild.memberCount} members`);
    }
}

module.exports = {
    ReadyListener
};