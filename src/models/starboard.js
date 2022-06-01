const mongoose = require('mongoose');

const starboardSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	channelID: String,
    emote: String

});

starboardSchema.index({ guildID: 1, channelID: 1, emote: 1 }, { 'unique': true });

const star = mongoose.model('Starboard', starboardSchema, 'starboards');

star.createIndexes();

module.exports = crwn;