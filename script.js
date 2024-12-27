let TX_POWER = 20
let TX_HEIGHT = 0
let TX_FREQUENCY = 2.4e+9
let jsonGainData = OMNI_GAIN
let wall_list = []
let show_tooltip = false

const canvas = document.getElementById('simulationCanvas');
ROWS = canvas.width
COLUMNS = canvas.height
const plot = new CanvasPlot(canvas, ROWS, COLUMNS); 

const context = canvas.getContext('2d');
wall_1 = new Wall(
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    {type:'Brick Wall',attenuation:10,color:'black'}
)

wall_2 = new Wall(
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    {type:'Dry Wall',attenuation:3,color:'blue'}
)

wall_3 = new Wall(
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    {type:'Concrete Wall',attenuation:12,color:'green'}
)

wall_4 = new Wall(
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    randomIntFromInterval(0,canvas.width),
    randomIntFromInterval(0,canvas.height),
    {type:'Door Solid Wood',attenuation:6,color:'red'}
)

wall_list.push(wall_1)
wall_list.push(wall_2)
wall_list.push(wall_3)
wall_list.push(wall_4)


transmitter = new Transmitter(canvas.width/2, canvas.height/2, TX_POWER, TX_HEIGHT, TX_FREQUENCY);

//plot.showLineToTransmitter(transmitter)
//plot.showLineToTransmitterSingleCell(transmitter,2,2)
//plot.calculateAndDrawSignalStrengthGain(transmitter,jsonGainData)
plot.calculateAndDrawSignalStrengthGainWallDetection(transmitter,jsonGainData)
transmitter.draw(context);
plot.drawWalls()
//plot.drawGrid(context)


const distance = transmitter.calculateDistance(150, 250);

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }