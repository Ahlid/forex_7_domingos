require('dotenv').config()
const utils = require('./util');
const discord = require('./discord')


const symbols = [
    'CHFEUR=X',
    'JMT.LS',
    'ETH-EUR',
    'AAL',
    'BTC-EUR',
    'SCP.LS',
    'DOGE-EUR',
    'GALP.LS',
    'EDPR.LS',
    'EDP.LS',
    'NIO'
];


async function getChanges(symbol) {

    const {yesterday, today} = await utils.getCurrentPrice(symbol);

    return {
        symbol,
        yesterday,
        today
    }
}

async function checkSingleStatus(symbol) {
    try {
        await discord.sendMessage(getMessageString(await getChanges(symbol)))
    } catch (e) {
        console.log(e)
    }
}

async function checkStatus() {

    await discord.sendMessage(`Yesterday vs Current Values in €`);

    for (let symbol of symbols) {
        await discord.sendMessage(getMessageString(await getChanges(symbol)))
    }

}

function getMessageString(info) {
    return `${info.symbol} ${info.yesterday} ====> ${info.today}  (${((info.today - info.yesterday) * 100 / info.yesterday).toFixed(2)}%)`
}

async function start() {
    await discord.startBot({checkSingleStatus})
    // await checkStatus();
    setInterval(checkStatus, 60 * 60 * 1000);//every hour
}

start()