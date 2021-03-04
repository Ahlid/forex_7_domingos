const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL = process.env.DISCORD_CHANNEL;


async function sendMessage(msg) {

    const channel = await bot.channels.fetch(CHANNEL);
    await channel.send(msg, 'hi')
}

async function startBot() {
    return new Promise(((resolve, reject) => {
        bot.login(TOKEN);

        bot.on('ready', async () => {
            sendMessage("Bot Online.")
            resolve(null);
        });

        bot.on('message', message => {
           //logging
        })
    }))
}


module.exports = {
    sendMessage,
    startBot
}

