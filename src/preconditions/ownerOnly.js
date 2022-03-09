const { Precondition } = require('@sapphire/framework');

class OwnerOnlyPrecondition extends Precondition {
    run(message) {
        return message.author.id === 'YOUR_ID'
            ? this.ok()
            : this.error({ message: 'Only the bot owner can use this command!' });
    }
}

module.exports = {
    OwnerOnlyPrecondition
};