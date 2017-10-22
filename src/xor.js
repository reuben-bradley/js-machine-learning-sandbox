/**
 * Inspired by the XOR demo for Synaptic - https://synaptic.juancazala.com/#/xor
 * 
 * @author Reuben Bradley
 */

const synaptic = require('synaptic');

const utils = require('./lib/utils');

(function main() {
    // Create our neural network
    // We'll use individual layers here, as it's a simple network, and easy to 
    //  demonstrate what's going on inside a synaptic.Perceptron
    const inputLayer = new synaptic.Layer(2);
    const hiddenLayer = new synaptic.Layer(3);
    const outputLayer = new synaptic.Layer(1);
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // Set up our training data and variables
    const trainingData = [
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [1] },
        { input: [1, 0], output: [1] },
        { input: [1, 1], output: [0] }
    ];
    const learningRate = 0.4;
    const trainingReps = 1000;
    
    const trainNetwork = function( data ) {
        for ( let i = 0; i < data.length; i++ ) {
            inputLayer.activate(data[i]['input']);
            hiddenLayer.activate();
            outputLayer.activate();
            outputLayer.propagate(learningRate, data[i]['output']);
            hiddenLayer.propagate(learningRate);
        }
    };
    
    const train = function( data, reps = trainingReps ) {
        for ( let i = 0; i < reps; i++ ) {
            data = utils.shuffleArray(data);
            trainNetwork(data);
        }
    };
    
    const test = function() {
        const testData = [
            { input: [0, 0], output: [0] },
            { input: [1, 0], output: [1] },
            { input: [0, 1], output: [1] },
            { input: [1, 1], output: [0] }
        ];
        let result;
        
        for ( let i = 0; i < testData.length; i++ ) {
            inputLayer.activate(testData[i]['input']);
            hiddenLayer.activate();
            result = Math.round( (outputLayer.activate())[0] );
            console.log(`Input: ${testData[i]['input']}, expected result: ${testData[i]['output']}, actual result: ${result}`);
        }
    };
    
    train(trainingData);
    test();
})();
