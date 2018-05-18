
var chartData = {
    labels: [],
    datasets: [{
        type: 'line',
        label: 'Real',
		backgroundColor: '#00e676',
		borderColor: '#66ffa6',
        borderWidth: 3,
        fill: false,
        data: []
    }, {
        type: 'line',
        label: 'Analysis',
        backgroundColor: '#c48b9f',
        data: [],
		borderColor: '#f8bbd0',
		fill: false,
        borderWidth: 3,
	}],
};

let ctx = document.getElementById('coin-chart').getContext('2d');
let coinChart = new Chart(ctx, {
	type: 'bar',
	data: chartData,
	options: {
		responsive: true,
		tooltips: {
			mode: 'index',
			intersect: true,
		},
		legend: {
			display: true,
			position: 'bottom'
		},
	}
});
