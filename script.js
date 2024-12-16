let TX_POWER = 20
let TX_HEIGHT = 0
let TX_FREQUENCY = 2.4e+9
let jsonGainData = OMNI_GAIN

const canvas = document.getElementById('simulationCanvas');
const plot = new CanvasPlot(canvas, 400, 250); 

const context = canvas.getContext('2d');
transmitter = new Transmitter(canvas.width/2, canvas.height/2, TX_POWER, TX_HEIGHT, TX_FREQUENCY);
plot.calculateAndDrawSignalStrengthGain(transmitter,jsonGainData)
transmitter.draw(context);
const distance = transmitter.calculateDistance(150, 250);