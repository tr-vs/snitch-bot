const { SapphireClient } = require('@sapphire/framework');
const { token } = require('../config');

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.login(token);