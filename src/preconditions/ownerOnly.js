const { Precondition } = require('@sapphire/framework');

class OwnerOnlyPrecondition extends Precondition {
    chatInputRun(interaction) {
        return interaction.user.id === '281604477457399818'
            ? this.ok()
            : this.error({ 
                message: 'Only the bot owner can use this command!',
                context: { silent: true }
            });
    }
}

module.exports = {
    OwnerOnlyPrecondition
};