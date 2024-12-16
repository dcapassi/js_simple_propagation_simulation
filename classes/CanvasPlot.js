function calculateAngle(transmitter, x, y) {
    const dx = x - transmitter.x;
    const dy = y - transmitter.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360; 
    return angle;
}

function getGainFromJson(json, angle) {
    const closest = json.reduce((prev, curr) => (
        Math.abs(curr.angle - angle) < Math.abs(prev.angle - angle) ? curr : prev
    ));
    return closest.gain;
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



    calculateAndDrawSignalStrengthGain(transmitter, json) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const { centerX, centerY } = this.getCellCenter(row, col);
                const signalStrength = transmitter.txPower - transmitter.calculateFPSL(centerX, centerY, 0);

                const angle = calculateAngle(transmitter, centerX, centerY);
                const gain = getGainFromJson(json, angle);

                const adjustedSignalStrength = signalStrength + gain;

         
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
}
