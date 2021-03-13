let data = [];
let lastData = [];

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000
    });


    server.route({
        method: 'POST',
        path: '/',
        handler: (request, h) => {

            lastData = data;
            data = JSON.parse(request.payload);
            return request.payload;
        }
    });


    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            const newData = [];


            if (lastData.length === 0 || lastData.length !== data.length) {
                return [];
            }

            for (let i = 0; i < data.length; i++) {
                const o = data[i];
                const oo = lastData[i]
                newData.push({...o, coin_copy: oo.coin, previousValue: oo.value})
            }

            return JSON.stringify(newData);
        }
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();