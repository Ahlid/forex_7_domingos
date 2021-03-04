const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL = process.env.DISCORD_CHANNEL;


async function sendMessage(msg) {

    const channel = await bot.channels.fetch(CHANNEL);
    await channel.send(msg)
}

async function startBot() {
    return new Promise(((resolve, reject) => {
        bot.login(TOKEN);

        bot.on('ready', async () => {
            resolve(null);
        });

        bot.on('message', message => {
            if (message.content.startsWith('get') && message.content.split(' ')[1]) {
                message.channel.send("https://finance.yahoo.com/quote/"+message.content.split(' ')[1]);
            }
        })
    }))
}


module.exports = {
    sendMessage,
    startBot
}

