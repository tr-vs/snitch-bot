const mongoose = require('mongoose');

module.exports = {
    init: async () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        mongoose.connect('mongodb+srv://egg:Missiontotheloot1Uzi@cluster0.tah2q.mongodb.net/Snitch?retryWrites=true&w=majority', dbOptions);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Mongooses has successfully connected!');
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose connection lost');
        });
    },
};