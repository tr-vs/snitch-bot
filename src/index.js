const { SapphireClient, LogLevel } = require('@sapphire/framework');
const { token } = require('../config');

const client = new SapphireClient({ 
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    defaultPrefix: '+',
    logger: {
        level: LogLevel.info
    }
});

client.login(token);