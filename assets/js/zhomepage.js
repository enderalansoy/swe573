// Progress bar for Axios
loadProgressBar()

// Selectize setup
$('#coins').selectize({
    labelField: 'name',
    valueField: 'symbol',
    maxItems: 5,
    persist: true,
    searchField: ['name', 'symbol'],
    sortField: 'rank',
    createOnBlur: false,
    create: false,
});

const selectize = $("#coins")[0].selectize;

// API call for list of coins
axios.get('/coin/coins').then((response) => {
    let coinlist = [];
    selectize.clear();
    selectize.clearOptions();
    selectize.load((callback) => {
        response.data.forEach((coin) => {
            coinlist.push({ name: coin.name, symbol: coin.symbol, id: coin.id, rank: coin.rank });
        });
        callback(coinlist);
    });
}).catch(() => {
    selectize.load((callback) => {
        callback([{ text:'Sorry, there is an error :(', value:'error' } ]);
    });
});

function analyze() {
    let selectionOrder = [];
    coinChart.data.labels = [];
    coinChart.data.datasets[0].data = [];
    coinChart.data.datasets[1].data = [];
    let selectedCoins = $.map(selectize.items, (value) => {
        coinChart.data.labels.push(`${selectize.options[value].name} (${selectize.options[value].symbol})`);
        axios.get(`/trends/${selectize.options[value].id}`).then((response) => {
            coinChart.data.datasets[0].data[selectize.items.indexOf(selectize.options[value].symbol)] = response.data.day;
            coinChart.update();
        });
        axios.get(`/sentiment/${selectize.options[value].symbol}`).then((response) => {
            if (response.data.score === 0 || typeof response.data.score === 'undefined') {
                axios.get(`/sentiment/${selectize.options[value].name}`).then((altres) => {
                    coinChart.data.datasets[1].data[selectize.items.indexOf(selectize.options[value].symbol)] = altres.data.score;
                    coinChart.update();
                });
            }
            coinChart.data.datasets[1].data[selectize.items.indexOf(selectize.options[value].symbol)] = response.data.score;
            coinChart.update();
        });
    });
}

$(document).ready(function() {
    $('#account-button').on('click', function() {
        console.log('hey');
        $('#login-modal').modal('show');
    });
});
