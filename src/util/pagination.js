const { replaceWith } = require("cheerio/lib/api/manipulation");
const { MessageActionRow } = require("discord.js");

module.exports = async (interaction, pages, time = 60000) => {
    if (!interaction || !pages || !(pages?.length > 0) || !(time > 10000)) throw new Error('Invalid parameters');
    console.log(pages.length)
    let index = 0, row = new MessageActionRow().addComponents([{
        type: 'BUTTON',
        customId: '1',
        emoji: '◀️',
        style: 'PRIMARY',
        disabled: index === 0
    }, {
        type: 'BUTTON',
        customId: '2',
        emoji: '▶️',
        style: 'PRIMARY',
        disabled: pages.length <= index + 1
    }, {
        type: 'BUTTON',
        customId: '3',
        emoji: '🗑',
        style: 'DANGER'
    }])
 
    const data = {
        embeds: [pages[index]],
        components: [row],
        fetchReply: true 
    }

    let msg;

    if (interaction.deferred || interaction.replied) {
        msg = await interaction.followUp(data);
    } else {
        msg = await interaction.reply(data);
    }

    const col = msg.createMessageComponentCollector({
        filter: i=>i.user.id === interaction.user.id,
        time
    })

    col.on('collect', (i) => {
        if (i.customId === '1') index --;
        else if (i.customId === '2') index++;
        else return col.stop();

        let newRow = new MessageActionRow().addComponents([{
            type: 'BUTTON',
            customId: '1',
            emoji: '◀️',
            style: 'PRIMARY',
            disabled: index === 0
        }, {
            type: 'BUTTON',
            customId: '2',
            emoji: '▶️',
            style: 'PRIMARY',
            disabled: pages.length <= index + 1
        }, {
            type: 'BUTTON',
            customId: '3',
            emoji: '🗑',
            style: 'DANGER'
        }])

        i.update({
            components: [newRow],
            embeds: [pages[index]]
        })
    })

    col.on('end', () => {
        msg.edit({
            components: []
        })
    })
}