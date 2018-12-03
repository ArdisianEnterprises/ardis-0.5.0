// tutorial: https://bocoup.com/blog/d3js-and-canvas
import getSong from './getSong';

const d3 = require('d3');

const width = 1000,
			height = 500,
			barPadding = 1,
			data = [1,6,12,15,16];

let visual = document.getElementById('visual'),
		canvasCtx,
		dataContainer,
		analyser,
		bufferLength = 206,
		frequencyData,
		svg;

const setUpAudio = () => {
	console.log('making audio. song: ', getSong())
	const audio = new Audio()
	audio.controls = true;
	audio.src = getSong();
	document.body.append(audio);

	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioCtx.createAnalyser();

	frequencyData = new Uint8Array(bufferLength); // array of integers
	console.log('frequencyData: ', frequencyData);

	// Load Web Audio
	window.addEventListener('load', () => {
		audioCtx.createMediaElementSource(audio).connect(analyser);
		analyser.connect(audioCtx.destination);
	}, false);

	createSvgD3();
};

const createSvgD3 = () => {
	svg = d3.select(visual).append('svg').attr('height', height).attr('width', width);
	console.log('svg: ', svg)

	// Bars
	// svg.selectAll('rect')
	// 	.data(frequencyData)
	// 	.enter()
	// 	.append('rect')
	// 	.attr('x', (d, i) => i * width / bufferLength)
	// 	.attr('width', width / bufferLength - barPadding);

	// Circles
	svg.selectAll('circle')
		.data(frequencyData)
		.enter()
		.append('circle')
		.attr('cx', (d, i) => {
			return (i * width / bufferLength) * (Math.random() * 2)- (Math.random() * i)
		})
		.attr('cy', (d, i) => {
			return (i * height / bufferLength) * Math.random() + (10 * Math.random())
		})
		.attr('r', (width / bufferLength - barPadding) * Math.random() * 20);

		renderChart();
};

const renderChart = () => {
	requestAnimationFrame(renderChart);

	// Map frequency data to frequencyData typed array
	analyser.getByteFrequencyData(frequencyData);

	// Update d3 visual with new data
	svg.selectAll('circle')
		.data(frequencyData)
		.attr('cy', d => height - d)
		.attr('r', d => d)
		.attr('fill', d => `rgb(255, 0, ${d})`);
};

const init = () =>{
	setUpAudio();
};

export default init();