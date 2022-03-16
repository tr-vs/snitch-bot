const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const Guild = require('../../models/guild');
const { MessageEmbed } = require('discord.js');

class SnipeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'snipe',
            description: 'view up to 3 recently deleted messages',
            RequriedClientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
        });
    }
    registerApplicationCommands(registry) {
        const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addNumberOption(option => 
                option 
                    .setName('index')
                    .setDescription('snipe X messages back')
                    .setMinValue(1)
                    .setMaxValue(3)
            )
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['953474518930829423']
		});
	}

    async chatInputRun(interaction) {
        if (interaction.channel.type != "dm") {
            const role = Guild.findOne({
                guildID: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        _id: mongoose.Types.ObjectId(),
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        sniperID: '1',
                    })
    
                    newGuild.save()
                    .catch(err => console.error(err))
    
                    const embed = new MessageEmbed()
                        .setDescription('`This server was not in my database. Please try again.`')
                        .setColor('#2f3136');
                    return interaction.reply({ embeds: [ embed ] });
                }
            });
    
            if (role == null) {
                return
            }
    
            if (role.sniperID != '1' && !interaction.member.roles.cache.has(role.sniperID) && !interaction.member.permissions.has('MANAGE_MESSAGES')) {
                const embed = new MessageEmbed()
                    .setDescription(`You are missing the ${interaction.guild.roles.cache.get(role.sniperID)} role.`)
                    .setColor('#2f3136');
                return interaction.reply({ embeds: [ embed ] });
            }
        }

        const snipes = this.container.client.snipes.get(interaction.channel.id) || [];
		const index = interaction.options.getNumber('index') ? interaction.options.getNumber('index') : 1;
        const msg = snipes[index - 1 || 0];	
					
		if (!msg) {
            const embed = new MessageEmbed()
                .setDescription('`Nothing was deleted.`')
                .setColor('#2f3136');
            return interaction.reply({ embeds: [ embed ] });
        }

        let footer;

        if(interaction.user.id == interaction.user.id) {
			footer = `Snipe ${index} out of ${snipes.length} • You sniped yourself doofus`;
		} else {
			footer = `Snipe ${index} out of ${snipes.length}`;
		}

        if (msg.reference === false) {
			const embed = new MessageEmbed()
				.setAuthor({ name: `Deleted by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true, size: 256 })})
				.setDescription(msg.content)
				.setColor('#2f3136')
				.setFooter({ text: footer })
			if (msg.image) embed.setImage(msg.image);
			return interaction.reply({ embeds: [ embed ] });
		} else {
			const embed = new MessageEmbed()
                .setAuthor({ name: `Deleted by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true, size: 256 })})
				.setDescription(`> ${msg.referenceContent}\n<@${msg.referenceAuthor.id}> ${msg.content}`)
				.setColor('#2f3136')
				.setFooter({ text: footer })
			if (msg.image) embed.setImage(msg.image);
			if (msg.referenceImage) embed.setThumbnail(msg.referenceImage);
			return interaction.reply({ embeds: [ embed ] });
		}
    }
}

module.exports = {
    SnipeCommand
};