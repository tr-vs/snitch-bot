const { Listener } = require('@sapphire/framework');
const Crown = require('../models/crowns');
const termFunction = require('../Functions/term');

class ReadyListener extends Listener {
    constructor(context, options) {
    super(context, {
        ...options,
    });
    }

    async run(member) {
        const crowns = Crown.deleteMany({
			guildID: member.guild.id,
			userID: member.user.id,
		}, (err) => {
			if(err) console.error(err);
		});

		const term = await termFunction.removeAllTerms(member.user.id, member.guild.id);
    }
}

module.exports = {
    ReadyListener
};