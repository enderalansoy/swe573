
window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(236, 238, 239)'
};

var chartData = {
    labels: [],
    datasets: [{
        type: 'line',
        label: 'Real',
		backgroundColor: 'black',
		borderColor: 'darkgray',
        borderWidth: 3,
        fill: false,
        data: []
    }, {
        type: 'bar',
        label: 'Analysis',
        backgroundColor: 'rgb(236, 238, 239)',
        data: [],
        borderColor: 'white',
        borderWidth: 2,
    }]

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
		}
	}
});
