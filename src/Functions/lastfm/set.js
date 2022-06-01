const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const Crown = require('../../models/crowns');
const mongoose = require('mongoose');

module.exports.Get = async (interaction) => {
    const username = interaction.options.getString('username');

    const params = stringify({
        method: 'user.getinfo',
        api_key: 'b97a0987d8be2614dae53778e3240bfd',
        format: 'json',
        user: username,
    });

    const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r => r.json());
    if (data.error === 6) {
        const embed = new MessageEmbed()
            .setDescription('`No valid last.fm username found. Please try again.`')
            .setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ] });
    }
    const settings = LastFMUser.findOne({
        authorID: interaction.user.id,
    }, (err, lfu) => {
        if (err) console.error(err);
        if(!lfu) {
            // eslint-disable-next-line no-shadow
            const lfu = new LastFMUser({
                _id: mongoose.Types.ObjectId(),
                authorID: interaction.user.id,
                user: username,
                embed: 1,
                downEmote: '775156840652603412',
                upEmote: '749536550261358613'
            });

            lfu.save().catch(err => console.error(err));

            const embed = new MessageEmbed()
                .setDescription('`Last.FM account successfully connected.`')
                .setColor('#2f3136');
            return interaction.reply({ embeds: [ embed ] });
        }
    });
    
    if (settings == null) {
        return;
    }

    settings.updateOne({
        user: username,
    });

    const crowns = Crown.deleteMany({
        userID: interaction.user.id,
    }, (err) => {
        if(err) console.error(err);
    });

    const embed = new MessageEmbed()
        .setDescription('`Last.FM account successfully updated.`')
        .setColor('#2f3136');
    return interaction.reply({ embeds: [ embed ] });		
}