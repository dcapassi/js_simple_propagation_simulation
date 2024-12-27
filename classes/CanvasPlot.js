let ANGLE = 0
function calculateAngle(transmitter, x, y) {
    const dx = x - transmitter.x;
    const dy = y - transmitter.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360; 
    return angle;
}


function getGainAtAngle(angle, antenna_gain_list) {
    angle = (angle + 360) % 360;

    let lower = null;
    let upper = null;

    for (let i = 0; i < antenna_gain_list.length; i++) {
        const current = antenna_gain_list[i];
        
        if (current.angle === angle) {
            return current.gain; // Exact match
        }

        if (current.angle < angle) {
            lower = current;
        } else if (current.angle > angle && upper === null) {
            upper = current;
            break; 
        }
    }

    if (!upper) {
        upper = antenna_gain_list[0];
    }

    // Linear interpolation between lower and upper
    if (lower && upper) {

        const ratio = (angle - lower.angle) / (upper.angle - lower.angle);
        const interpolatedGain = lower.gain + ratio * (upper.gain - lower.gain);
        return interpolatedGain;
    }

    return undefined;
}


class CanvasPlot {
    constructor(canvas, rows, cols) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.rows = rows; 
        this.cols = cols; 
        this.cellWidth = canvas.width / cols;
        this.cellHeight = canvas.height / rows;
    }

    getCellCenter(row, col) {
        const centerX = col * this.cellWidth + this.cellWidth / 2;
        const centerY = row * this.cellHeight + this.cellHeight / 2;
        return { centerX, centerY };
    }

        writeRowCol() {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const { centerX, centerY } = this.getCellCenter(row, col);    
                    this.context.font = "10px Arial";
                    this.context.fillStyle = "black";
                    this.context.textAlign = "center";
                    this.context.fillText("["+row+"]"+" "+"["+col+"]", centerX, centerY);
                }
            }
        }

        writeCenterXY() {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const { centerX, centerY } = this.getCellCenter(row, col);    
                    this.context.font = "10px Arial";
                    this.context.fillStyle = "black";
                    this.context.textAlign = "center";
                    this.context.fillText("("+centerX+','+centerY+")", centerX, centerY);
                }
            }
        }

    calculateAndWriteDistances(transmitter) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const distance = transmitter.calculateDistance(centerX, centerY, 0);

                this.context.font = "10px Arial";
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.fillText(distance.toFixed(2), centerX, centerY);
            }
        }
    }



    calculateAndDrawSignalStrengthGain(transmitter, antenna_gain_list) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const signalStrength = transmitter.txPower - transmitter.calculateFPSL(centerX, centerY, 0);

                const angle = calculateAngle(transmitter, centerX, centerY);
                const gain = getGainAtAngle(angle, antenna_gain_list)

                const adjustedSignalStrength = signalStrength + gain;

         
                const color = this.getSignalColor(adjustedSignalStrength);

                this.context.fillStyle = color;

                const cellWidth = (col === this.cols - 1) ? this.canvas.width - col * this.cellWidth : this.cellWidth;
                const cellHeight = (row === this.rows - 1) ? this.canvas.height - row * this.cellHeight : this.cellHeight;

                this.context.fillRect(col * this.cellWidth, row * this.cellHeight, cellWidth, cellHeight);
                
                if(true){
                    this.context.font = "10px Arial";
                    this.context.fillStyle = "black";
                    this.context.textAlign = "center";
                    this.context.fillText(adjustedSignalStrength.toFixed(2), centerX, centerY);
                }
            }
        }
    }

    
    calculateAndWriteFSPL(transmitter) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const distance = transmitter.calculateFPSL(centerX, centerY, 0);

                this.context.font = "10px Arial";
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.fillText(distance.toFixed(2), centerX, centerY);
            }
        }
    }

        
    calculateAndWriteSignalStrength (transmitter) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const signalStrength = transmitter.txPower - transmitter.calculateFPSL(centerX, centerY, 0);

                this.context.font = "10px Arial";
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.fillText(signalStrength.toFixed(2), centerX, centerY);
            }
        }
    }

    
    calculateAndDrawSignalStrength(transmitter) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const signalStrength = transmitter.txPower - transmitter.calculateFPSL(centerX, centerY, 0);
    
                const color = this.getSignalColor(signalStrength);
                this.context.fillStyle = color;
  
                const cellWidth = (col === this.cols - 1) ? this.canvas.width - col * this.cellWidth : this.cellWidth;
                const cellHeight = (row === this.rows - 1) ? this.canvas.height - row * this.cellHeight : this.cellHeight;
  
                this.context.fillRect(col * this.cellWidth, row * this.cellHeight, cellWidth, cellHeight);

                if(false){
                    this.context.font = "10px Arial";
                    this.context.fillStyle = "black";
                    this.context.textAlign = "center";
                    this.context.fillText(signalStrength.toFixed(2), centerX, centerY);
                }
}
        }
    }
    
    getSignalColor(signalStrength) {
        const colorMapping = [
            { min: -30, max: Infinity, color: "#FF4C4C" },
            { min: -35, max: -30, color: "#FF5A4C" },
            { min: -40, max: -35, color: "#FF784C" },
            { min: -45, max: -40, color: "#FE964C" },
            { min: -50, max: -45, color: "#FEB34C" },
            { min: -55, max: -50, color: "#FDD14C" },
            { min: -60, max: -55, color: "#FCEE4C" },
            { min: -65, max: -60, color: "#EDFC4C" },
            { min: -70, max: -65, color: "#CFFA4C" },
            { min: -75, max: -70, color: "#B1D641" },
            { min: -80, max: -75, color: "#D6D6D6" },
            { min: -Infinity, max: -80, color: "gray" },
        ];
    
        for (const range of colorMapping) {
            if (signalStrength >= range.min && signalStrength < range.max) {
                return range.color;
            }
        }
    
        return "gray"; // Default color if no range matches
    }


    calculateAndDrawSignalStrengthGainWallDetection(transmitter, antenna_gain_list) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const signalStrength = transmitter.txPower - transmitter.calculateFPSL(centerX, centerY, 0);

                const angle = calculateAngle(transmitter, centerX, centerY);
                const gain = getGainAtAngle(angle, antenna_gain_list)
                let loss = 0
                wall_list.forEach( wall => {
                    let cross_wall = this.checkIfLineCrosses(transmitter,centerX,centerY,wall)
                    if(cross_wall){
                        loss = loss + wall.walltype.attenuation
                    }
                })

                const adjustedSignalStrength = signalStrength + gain - loss;

         
                const color = this.getSignalColor(adjustedSignalStrength);

                this.context.fillStyle = color;

                const cellWidth = (col === this.cols - 1) ? this.canvas.width - col * this.cellWidth : this.cellWidth;
                const cellHeight = (row === this.rows - 1) ? this.canvas.height - row * this.cellHeight : this.cellHeight;

                this.context.fillRect(col * this.cellWidth, row * this.cellHeight, cellWidth, cellHeight);
                
                if(false){
                    this.context.font = "10px Arial";
                    this.context.fillStyle = "black";
                    this.context.textAlign = "center";
                    this.context.fillText(adjustedSignalStrength.toFixed(2), centerX, centerY);
                }
            }
        }
    }

    drawWalls(){

        wall_list.forEach(wall =>{

            this.context.beginPath();
            this.context.moveTo(wall.p1x,wall.p1y)
            this.context.lineTo(wall.p2x,wall.p2y)
            this.context.lineWidth = 5;
            this.context.strokeStyle = wall.walltype.color
            this.context.stroke();
            this.context.lineWidth = 1;


        })

    }

    drawGrid() {
        this.context.strokeStyle = "gray";
        for (let row = 0; row <= this.rows; row++) {
            const y = row * this.cellHeight;
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
            this.context.stroke();
        }

        for (let col = 0; col <= this.cols; col++) {
            const x = col * this.cellWidth;
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
            this.context.stroke();
        }
    }


    showLineToTransmitter(transmitter) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                this.context.beginPath();
                this.context.moveTo(centerX, centerY);
                this.context.lineTo(transmitter.x, transmitter.y);
                this.context.stroke();


                this.context.font = "12px Arial";
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.fillText(this.checkIfLineCrosses(transmitter, centerX, centerY, wall), centerX, centerY);
            }
        }
    }

    showLineToTransmitterSingleCell(transmitter,row,col) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                this.context.beginPath();
                this.context.moveTo(centerX, centerY);
                this.context.lineTo(transmitter.x, transmitter.y);
                this.context.stroke();


                this.context.font = "12px Arial";
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                showLineToTransmitterthis.context.fillText(this.checkIfLineCrosses(transmitter, centerX, centerY), centerX, centerY);


    }


    checkIfLineCrosses(transmitter,centerX,centerY,wall) {
        //Creating the point the wall
        const W1 = create_point(wall.p1x, wall.p1y)
        const W2 = create_point(wall.p2x, wall.p2y)


        //Creating the Transmitter
        const T1 = create_point(transmitter.x, transmitter.y)
        const T2 = create_point(centerX, centerY)


        // Creating the vectors
        const W_vector = create_vector(W1,W2)
        const T_vector = create_vector(T1,T2)
        const T1_W1_vector = create_vector(T1,W1)
        const T1_W2_vector = create_vector(T1,W2)
        const W1_T1_vector = create_vector(W1,T1)
        const W1_T2_vector = create_vector(W1,T2)


        // Doing the cross product
        const cross1 = cross_product(T_vector,T1_W1_vector)
        const cross2 = cross_product(T_vector,T1_W2_vector)
        const cross3 = cross_product(W_vector,W1_T1_vector)
        const cross4 = cross_product(W_vector,W1_T2_vector)


        if (cross1 * cross2 < 0 && cross3 * cross4 < 0){
            return true}

        // Special case: Check if points lie on the same line (collinear)
        const isCollinear = (cross1 === 0 && isPointOnSegment(W1, T1, T2)) ||
        (cross2 === 0 && isPointOnSegment(W2, T1, T2)) ||
        (cross3 === 0 && isPointOnSegment(T1, W1, W2)) ||
        (cross4 === 0 && isPointOnSegment(T2, W1, W2));
        if (isCollinear) {
        return true;
        }
    

}


}

function cross_product(vector1,vector2){
    return vector1[0] * vector2[1] - vector1[1] * vector2[0]
  }

  function create_vector(point1,point2){
    return [point2.x - point1.x, point2.y - point1.y]
  }

  
  function create_point(x,y){
    return {x:x, y:y}
  }

  function isPointOnSegment(point, segStart, segEnd) {
    const minX = Math.min(segStart.x, segEnd.x);
    const maxX = Math.max(segStart.x, segEnd.x);
    const minY = Math.min(segStart.y, segEnd.y);
    const maxY = Math.max(segStart.y, segEnd.y);

    return (
        point.x >= minX && point.x <= maxX &&
        point.y >= minY && point.y <= maxY
    );
}
