const synaptic = require('synaptic');

const utils = require('./lib/utils');

(function main() {
    // Create our neural network
    //  Input will be a 7-digit binary number
    //  Output will be 4 neurons - one to represent each outcome: coat, sweater, t-shirt, and asbestos
    const temperatureNN = new synaptic.Architect.Perceptron(7, 3, 3, 4);
    const nnTrainer = new synaptic.Trainer(temperatureNN);
    
    // Generate training data
    let trainingSet = [];
    let temp, output;
    for ( let i = 0; i < 200; i++ ) {
        // Generate a random temperature between 0 and 70 C
        temp = Math.floor(Math.random() * 70);
        output = [0, 0, 0, 0];
        
        if ( temp <= 5 ) {
            output[0] = 1;
        }
        else if ( temp > 5 && temp <= 15 ) {
            output[1] = 1;
        }
        else if ( temp > 15 && temp <= 40 ) {
            output[2] = 1;
        }
        else {
            output[3] = 1;
        }
        
        trainingSet.push({
            input: utils.convertIntToBinary(temp, 7),
            output: output
        });
    }
    
    nnTrainer.train(trainingSet, {
        rate: 0.2,
        iterations: 1000,
        shuffle: true
    });
    
    // Now that the network is trained, let's give it a test run
    let testSet = [3, 8, 25, 48, 75];
    let binaryTemp, recommendations;
    for ( let i = 0, ln = testSet.length; i < ln; i++ ) {
        binaryTemp = utils.convertIntToBinary(testSet[i], 7);
        recommendations = temperatureNN.activate(binaryTemp);
        console.log(`For temperature: ${testSet[i]} C`);
        console.log(`COAT: ${utils.formatAsPercentage(recommendations[0])}%`);
        console.log(`SWEATER: ${utils.formatAsPercentage(recommendations[1])}%`);
        console.log(`T-SHIRT: ${utils.formatAsPercentage(recommendations[2])}%`);
        console.log(`ASBESTOS: ${utils.formatAsPercentage(recommendations[3])}%`);
    }
})();
