const { SlashCommandBuilder } = require('@discordjs/builders');
const { Command, RegisterBehavior } = require('@sapphire/framework');
const Discord = require('discord.js');
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;
const Canvas = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');

class GoesOnlineCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'goesonline',
            description: 'Generate a custom meme.'
        });
    }
    registerApplicationCommands(registry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
            .addStringOption(option => option.setName('victim').setDescription('Name of the victim').setRequired(true))
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			guildIds: ['720435717192548374'],
            idHints: ['981721802093002792']
		});
	}

    async chatInputRun(interaction) {
        const canvas = Canvas.createCanvas(700, 700);
        const text = 'sees ' + interaction.options.getString('victim');
        const ctx = canvas.getContext('2d');
        const backgroundFile = await readFile('src/goesonline.jpg');
        const background = new Canvas.Image();
        background.src = backgroundFile;

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        CanvasTextWrapper(canvas, text, {
            font: '70px Arial, sans-serif',
            textAlign: 'center',
            paddingY: 120,
        });

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
		return interaction.reply({ files: [attachment] });
    }
}

module.exports = {
    GoesOnlineCommand
};