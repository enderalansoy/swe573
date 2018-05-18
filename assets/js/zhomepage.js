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
        if (getCookie('id')) {
            console.log('heeh')
            axios.get(`/user/getfavorites?id=${getCookie('id')}`).then((response) => {
                response.data.forEach((item) => {
                    console.log(item);
                    selectize.addItem(item);
                });
            });
        }
        callback(coinlist);
    });
}).catch(() => {
    selectize.load((callback) => {
        callback([{ text:'Sorry, there is an error :(', value:'error' } ]);
    });
});

function favorite() {
    let favorites = JSON.stringify(selectize.items);
    favorites = favorites.replace(/['"]+/g, '');
    favorites = favorites.replace(/[\])}[{(]/g, ''); 
    axios.get(`/user/setfavorites?favorites=${favorites}`).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(error);
    });
}

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

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

$(document).ready(function() {
    if (getCookie('verificationmail')) {
        $('#verification').modal('show');
    }
    console.log(document.cookie);
    $('#account-button').on('click', () => {
        if (getCookie('id')) {
            $('#loggedin-modal').modal('show');
        } else {
            $('#login-modal').modal('show');
        }
    });
});
