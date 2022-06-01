const { Listener } = require('@sapphire/framework');

class MessageUpdateListener extends Listener {
    constructor(context, options) {
    super(context, {
        ...options,
    });
    }

    async run(message) {
        if(message.author.bot) return;
		
		const edits = message.client.edits.get(message.channel.id) || [];
		let content = message.content;
		if (content.length > 2048) {
			content = content.slice(0, 2040);
			content += '...';
		}

		if (message.reference === null) {
			edits.unshift({
				content,
				author: message.author,
				image: message.attachments.first() ? message.attachments.first().proxyURL : null,
				reference: false,
			});
		} else {
			try {
				const reference = await this.container.client.channels.cache.get(message.reference.channelID).messages.fetch(message.reference.messageID);

				edits.unshift({
					content,
					author: message.author,
					image: message.attachments.first() ? message.attachments.first().proxyURL : null,
					reference: true,
					referenceContent: reference.content,
					referenceAuthor: reference.author,
					referenceImage: reference.attachments.first() ? reference.attachments.first().proxyURL : null,
				});
			} catch (err) {
				edits.unshift({
					content,
					author: message.author,
					image: message.attachments.first() ? message.attachments.first().proxyURL : null,
					reference: false,
				});
			}
		}
		edits.splice(3);
		message.client.edits.set(message.channel.id, edits);
    }
}

module.exports = {
    MessageUpdateListener
};