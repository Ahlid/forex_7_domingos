require('dotenv').config()
const utils = require('./util');
const discord = require('./discord')


const symbols = [
    'CHFEUR=X', 'ETH-EUR','BTC-EUR', 'DOGE-EUR', 'XLM-EUR',
    'JMT.LS',
    'AAL',
    'SCP.LS',
    'GALP.LS',
    'EDPR.LS',
    'EDP.LS',
    'NIO',
    'AAPL',
    'AMZN'
];


async function getChanges(symbol) {

    const {yesterday, today,longName} = await utils.getCurrentPrice(symbol);

    return {
        longName,
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

    try {
    const msg = ['Yesterday vs Current Values in €'];
    for (let symbol of symbols) {
        msg.push(getMessageString(await getChanges(symbol)));
    }
    await discord.sendMessage(msg.join('\n'))
    }catch (e){
        console.log(e);
    }

}

function getMessageString(info) {
    return `${info.longName}(${info.symbol}) ${info.yesterday} ====> ${info.today}  (${((info.today - info.yesterday) * 100 / info.yesterday).toFixed(2)}%)`
}

async function start() {
    await discord.startBot({checkSingleStatus})
    await checkStatus();
    setInterval(checkStatus, 60 * 60 * 1000);//every hour
}

start()