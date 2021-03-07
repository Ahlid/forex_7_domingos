const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL = process.env.DISCORD_CHANNEL;

async function sendMessage(msg) {
    const channel = await bot.channels.fetch(CHANNEL);
    await channel.send(msg);
}

function whoAmI() {
    return new Discord.MessageEmbed()
        .setColor('#ff4444')
        .setTitle('What do I do?')
        .setURL('https://finance.yahoo.com/')
        .setAuthor('Some of LISGO', 'https://i.imgur.com/yGfnpU0.mp4')
        .setDescription(
            'This bot is made to remind you of all the money you are spending'
        )
        .setThumbnail('https://i.imgur.com/sFq0wAC.jpg')
        .addFields(
            { name: 'Crypto', value: 'TO THE MOON!!🚀🚀🚀', inline: true },
            { name: 'Stonks', value: 'Slow grow...🐌', inline: true }
        )
        .setImage('https://i.imgur.com/7YNJDVU.gif')
        .setTimestamp()
        .setFooter(
            'May Elon be on our side',
            'https://i.imgur.com/r7A2qYi.jpg'
        );
}

async function startBot({ checkSingleStatus }) {
    return new Promise((resolve, reject) => {
        bot.login(TOKEN);

        bot.on('ready', async () => {
            console.log('READY');
            resolve(null);
        });

        bot.on('message', (message) => {
            if (
                message.content.startsWith('get') &&
                message.content.split(' ')[1]
            ) {
                message.channel.send(
                    'https://finance.yahoo.com/quote/' +
                        message.content.split(' ')[1]
                );
            }
            if (
                message.content.startsWith('check') &&
                message.content.split(' ')[1]
            ) {
                checkSingleStatus(message.content.split(' ')[1]);
            }
            if (message.content.startsWith('whoami')) {
                message.channel.send(whoAmI());
            }
        });
    });
}

module.exports = {
    sendInfo,
    sendMessage,
    startBot,
};
