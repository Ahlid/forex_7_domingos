require('dotenv').config()
const utils = require('./util');
const discord = require('./discord')
const QuickChart = require('quickchart-js');


const symbols = [
    'CHFEUR=X', 'ETH-EUR', 'BTC-EUR', 'DOGE-EUR', 'XLM-EUR', 'ADA-EUR',
    'JMT.LS',
    'AAL',
    'EDPR.LS',
    'NIO',
    'AAPL',
    'AMZN'
];


async function getChanges(symbol) {

    return {...(await utils.getCurrentPrice(symbol)), symbol};

}

async function checkSingleStatus(symbol) {
    try {
        await discord.sendMessage("```diff\n" + getMessageString(await getChanges(symbol)) + "```");
    } catch (e) {
        console.log(e)
    }
}

async function checkStatusEdit() {
    await checkStatus(true)
}

async function checkStatus(edit = false) {

    try {
        const title = 'Yesterday vs Current Values in €';
        const str = [];
        const todayData = [];
        const yesterdayData = [];
        const percentData = [];
        const fields = []
        for (let symbol of symbols) {
            const info = await getChanges(symbol);
            todayData.push(info.today)
            yesterdayData.push(info.yesterday)
            percentData.push(info.percentage)

            str.push(getMessageString(info))

        }


        const lineChart = {
            type: 'bar',
            data: {
                labels: symbols,
                datasets: [{
                    label: '%',
                    data: percentData
                }]
            }
        }


        const myChart = new QuickChart();
        myChart
            .setConfig(lineChart)
            .setWidth(500)
            .setHeight(400)
            .setBackgroundColor('white');

        const exampleEmbed = {
            color: 0x0099ff,
            title,
            description: "```diff\n" + str.join('\n')
                + "```",
            timestamp: new Date(),
            footer: {text: "\u3000".repeat(100/*any big number works too*/) + "|"}
        };


        if (edit) {
            await discord.sendMessage({embed: exampleEmbed}, {
                channel: '819587858401722408',
                message_id: '819588109011779606'
            })
            await discord.sendMessage(await myChart.getShortUrl(), {
                channel: '819587858401722408',
                message_id: '819588110685962270'
            })
        } else {
            await discord.sendMessage({embed: exampleEmbed});
            await discord.sendMessage(await myChart.getShortUrl());

        }
    } catch (e) {
        console.log(e);
    }

}


function getMessageString(info) {
    return `${info.percentage > 0 ? '+' : '-'} ${info.shortName}(${info.symbol}) ${info.yesterday} => ${info.today}  (${info.percentage}%)`
}

async function start() {
    await discord.startBot({checkSingleStatus, checkStatus})
    setInterval(checkStatusEdit, 5 * 60 * 1000);//every 5min
    setInterval(checkStatus, 3 * 60 * 60 * 1000);//every 3h
}

start()