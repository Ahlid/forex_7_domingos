require('dotenv').config();
const utils = require('./util');
const discord = require('./discord');
const QuickChart = require('quickchart-js');
const fs = require('fs');

require('./binanceCrawler')


const {crypto, stocks} = JSON.parse(fs.readFileSync('symbols.json'));
const symbols = [...crypto, ...stocks];

function addCrypto(symbol) {
    crypto.push(symbol);
    updateSymbols();
}

function addStock(symbol) {
    stock.push(symbol);
    updateSymbols();
}

function updateSymbols() {
    fs.writeFileSync(
        'symbols.json',
        JSON.stringify({crypto, stocks}, null, 2)
    );
}

async function getChanges(symbol) {
    return {...(await utils.getCurrentPrice(symbol)), symbol};
}

async function checkSingleStatus(symbol) {
    try {
        await discord.sendMessage(
            '```diff\n' + getMessageString(await getChanges(symbol)) + '```'
        );
    } catch (e) {
        console.log(e);
    }
}

async function checkStatusEdit() {

    await checkStatus(true, true)
}

async function checkStatus(edit = false, graph = false) {

    try {
        const title = 'Yesterday vs Current Values in €';
        const str = [];
        const todayData = [];
        const yesterdayData = [];
        const percentData = [];
        const fields = [];
        for (let symbol of symbols) {
            const info = await getChanges(symbol);
            todayData.push(info.today);
            yesterdayData.push(info.yesterday);
            percentData.push(info.percentage);

            str.push(getMessageString(info));
        }

        const lineChart = {
            type: 'bar',
            data: {
                labels: symbols,
                datasets: [
                    {
                        label: '%',
                        data: percentData,
                    },
                ],
            },
        };

        const myChart = new QuickChart();
        myChart
            .setConfig(lineChart)
            .setWidth(500)
            .setHeight(400)
            .setBackgroundColor('white');

        const exampleEmbed = {
            color: 0x0099ff,
            title,
            description: '```diff\n' + str.join('\n') + '```',
            timestamp: new Date(),
            footer: {
                text: '\u3000'.repeat(100 /*any big number works too*/) + '|',
            },
        };

        if (edit) {
            await discord.sendMessage(
                {embed: exampleEmbed},
                {
                    channel: '819587858401722408',
                    message_id: '819588109011779606',
                }
            );
            await discord.sendMessage(await myChart.getShortUrl(), {
                channel: '819587858401722408',
                message_id: '819588110685962270',
            });
        } else {
            await discord.sendMessage({embed: exampleEmbed});
            if (graph)
                await discord.sendMessage(await myChart.getShortUrl());

        }
    } catch (e) {
        console.log(e);
    }
}

function getMessageString(info) {
    return `${info.percentage > 0 ? '+' : '-'} ${info.shortName}(${
        info.symbol
    }) ${info.yesterday} => ${info.today}  (${info.percentage}%)`;
}

async function start() {
    await discord.startBot({
        checkSingleStatus,
        checkStatus,
        addCrypto,
        addStock,
    });
    setInterval(checkStatusEdit, 1 * 60 * 1000);//every min
    setInterval(checkStatus, 1 * 60 * 60 * 1000);//every 1h
}

start();
