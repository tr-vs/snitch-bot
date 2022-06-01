const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

class RoleCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'role',
            description: 'Assign a role which restricts usage of the snipe and image commands.',
            requiredUserPermissions: ['ADMINISTRATOR']
        });

    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addRoleOption(role =>
                role
                    .setName('role')
                    .setDescription('the role in which you want to give the perms to')
                    .setRequired(true)
            )
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
		});
	}

    async chatInputRun(interaction) {
        const roleid = interaction.options.getRole('role').id;

        const settings = await Guild.findOne({
			guildID: interaction.guildId,
		}, (err, guild) => {
			if (err) console.error(err);
			if(!guild) {
				const newGuild = new Guild({
					_id: mongoose.Types.ObjectId(),
					guildID: interaction.guildId,
					guildName: interaction.guild.name,
					sniperID: '1',
				});

				newGuild.save()
					.then(result => console.log(result))
					.catch(err => console.error(err));

                return interaction.reply({ content: 'This server was not in my database! I just have added it, please try again.' });
			}
		});


		await settings.updateOne({
			sniperID: roleid,
		});
		const embed = new MessageEmbed()
			.setDescription(`Permissions successfully set for the role: ${message.guild.roles.cache.get(roleid)}`)
			.setColor('#2f3136');
        return interaction.reply({ embeds: [ embed ] })
    }
}

module.exports = {
    RoleCommand
};