function client() {

    var copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    var coins = document.getElementsByClassName('css-7ea2d1');
    var values = document.getElementsByClassName('css-1xsco8x')
    var str = ''
    var oo = [];
    for (var i = 0; i < coins.length; i++) {
        oo.push({coin: coins[i].textContent.replace('/', ''), value: values[i].textContent.replace('/ €', '')});
        str += (coins[i].textContent.replace('/', '')) + '#' + values[i].textContent.replace('/ €', '') + '\n'
    }

    fetch('http://localhost:3000/', {
        method: 'POST', body: JSON.stringify(oo), mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).then(r => console.log(r))

}

setInterval(client,10000)