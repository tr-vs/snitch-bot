const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { token } = require('../../../config');

class BannerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'banner',
            description: 'Check a user\'s banner'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addUserOption(option => option.setName('user').setDescription('whoever\'s banner you want to view'))
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
			idHints: ['957499302152912917']
		});
	}

    async chatInputRun(interaction) {
        const uid = interaction.options.getUser('user') ? interaction.options.getUser('user').id : interaction.user.id;
        let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${token}`
            }
        })

        let receive = ''
        let banner = "No banner found!"

        response.then(a => {
            if(a.status !== 404) {
                a.json().then(data => {
                    receive = data['banner']

                    if(receive !== null) {

                        let response2 = fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bot ${token}`
                            }
                        })
                        let statut = ''
                        response2.then(b => {
                            statut = b.status

                            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`
                            if(statut === 415) {
                                banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`
                            }

                        })
                    }
                })
            }
        })

        setTimeout(() => {

            interaction.reply(banner);
            
        }, 1000)
    }
}

module.exports = {
    BannerCommand
};