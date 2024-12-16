document.addEventListener('click',(e)=>{
    if (e.target === canvas){
    context.clearRect(0, 0, canvas.width, canvas.height);

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    transmitter = new Transmitter(mouseX, mouseY, TX_POWER, TX_HEIGHT, TX_FREQUENCY);
    plot.calculateAndDrawSignalStrengthGain(transmitter,jsonGainData)
    transmitter.draw(context);

    //plot.drawGrid();
    }


})


document.getElementById('applySettingsButton').addEventListener('click', () => {
    const txPower = 10* Math.log10(parseFloat(document.getElementById('txPowerInput').value));
    const txHeight = parseFloat(document.getElementById('txHeightInput').value);
    const frequency = parseFloat(document.getElementById('frequencySelect').value.split('_')[1]);
    const frequency_text = document.getElementById('frequencySelect').value.split('_')[0];
    const antennaType = document.getElementById('antennaType').value;
    
    TX_FREQUENCY = frequency
    TX_POWER = txPower
    TX_HEIGHT = txHeight

    transmitter.txPower = TX_POWER
    transmitter.height = TX_HEIGHT
    transmitter.frequency = TX_FREQUENCY

    if (antennaType == 'DIRECTIONAL'){
        console.log(frequency_text)
        if (frequency_text=='2-4GHz'){
            jsonGainData = DIRECTIONAL_24GHZ_GAIN
        }
        if (frequency_text=='5GHz'){
            jsonGainData = DIRECTIONAL_5GHZ_GAIN
        }
    }else{
        jsonGainData = OMNI_GAIN
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    plot.calculateAndDrawSignalStrengthGain(transmitter,jsonGainData)

    transmitter.draw(context);

});


document.addEventListener('mousemove', (e)=>{
    if (e.target === canvas){

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const signalStrength = transmitter.txPower - transmitter.calculateFPSL(mouseX, mouseY, 0);

        const angle = calculateAngle(transmitter, mouseX, mouseY);
        const gain = getGainFromJson(jsonGainData, angle);

        const adjustedSignalStrength = signalStrength + gain;
        const distanceTooltip = transmitter.calculateDistance(mouseX, mouseY,0)
        const FSPLTooltip = transmitter.calculateFPSL(mouseX, mouseY, 0)

        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        tooltip.style.top = `${e.clientY - rect.top + 10}px`;
        tooltip.innerHTML = 
        "RSSI: " + adjustedSignalStrength.toFixed(0) + " dBm" + "<br>" +
        "Distance: " + distanceTooltip.toFixed(0) + " m" + "<br>" +
        "FSPL: " + FSPLTooltip.toFixed(0) + " dB";

    } else{
        tooltip.style.display = 'none';

    }
})