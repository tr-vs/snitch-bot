const { SapphireClient, LogLevel } = require('@sapphire/framework');
const { token } = require('../config');
const mongo = require('./util/mongoose.js');

const client = new SapphireClient({ 
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'],
    defaultPrefix: '+',
    logger: {
        level: LogLevel.info
    }
});

mongo.init();

client.snipes = new Map();
client.edits = new Map();
client.ghosts = new Map();

client.login(token);