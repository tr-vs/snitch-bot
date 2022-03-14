const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');

class PingCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ping',
            aliases: ['pong'],
            description: 'ping pong',
            cooldownDelay: Time.Second * 10,
            cooldownFilteredUsers: ['281604477457399818'],
            runIn: CommandOptionsRunTypeEnum.GuildAny,
            requiredUserPermissions: ['BAN_MEMBERS'],
            requiredClientPermissions: ['BAN_MEMBERS']
        });
    }

    async messageRun(message) {
        const msg = await message.channel.send('Ping?');

        const content = `Pong from JavaScript! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
            msg.createdTimestamp - message.createdTimestamp
        }ms.`;

        return msg.edit(content);
    }
}

module.exports = {
    PingCommand
};