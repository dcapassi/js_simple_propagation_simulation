class Transmitter {
    constructor(x, y, txPower, height, frequency) {
        this.x = x; 
        this.y = y; // 
        this.txPower = txPower; 
        this.height = height;
        this.frequency = frequency
    }

    calculateDistance(x, y, z) {
        const dx = x - this.x;
        const dy = y - this.y;
        const dz = z - this.height;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    calculateFPSL(x,y,z){
        return 20*Math.log10(this.calculateDistance(x,y,z))+20*Math.log10(this.frequency)+20*Math.log10(4*Math.PI/299792458)
    }

    displayInfo() {
        console.log(`Transmitter Info:`);
        console.log(`Location: (${this.x}, ${this.y})`);
        console.log(`Tx Power: ${this.txPower} dBm`);
        console.log(`Frequency: ${this.frequency} Hz`);
        console.log(`Height: ${this.height} meters`);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, 5, 0, Math.PI * 2, true); // Circle with radius 20px
        context.fillStyle = "blue"; // Fill color for the circle
        context.fill();
        context.strokeStyle = "black"; // Border color for the circle
        context.stroke();
    }

}



