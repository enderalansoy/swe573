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
    console.log(response);
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
    coinChart.data.labels = [];
    let selectedCoins = $.map(selectize.items, (value) => {
        axios.get('/trends/' + selectize.options[value].id).then((response) => {
            coinChart.data.labels.push(`${response.data.name} (${response.data.symbol})`);
            coinChart.data.datasets[0].data.push(response.data.day);
            coinChart.update();
        });
    });
}