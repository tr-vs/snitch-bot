const mongoose = require('mongoose');

const coverSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userID: String,
	lastfmuser: String,
    albumName: String,
    coverURL: String,
});

coverSchema.index({ userID: 1, albumName: 1 }, { 'unique': true });

const cover = mongoose.model('Cover', coverSchema, 'covers');

cover.createIndexes();

module.exports = cover;