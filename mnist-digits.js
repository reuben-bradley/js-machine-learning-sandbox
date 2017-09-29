const fs = require('fs');
const synaptic = require('synaptic');

const utils = require('./lib/utils');
const labelLoader = require('./lib/mnist-label-loader');
const imageLoader = require('./lib/mnist-image-loader');

(function main() {
    const trainImageFile = './data/train-images.idx3-ubyte';
    const trainLabelFile = './data/train-labels.idx1-ubyte';
    const testImageFile = './data/t10k-images.idx3-ubyte';
    const testLabelFile = './data/t10k-labels.idx1-ubyte';
    const pixelMax = 255;
    const maxSetSize = 10000;
    
    // Create our neural network
    const digitNN = new synaptic.Architect.Perceptron(784, 75, 10);
    const digitTrainer = new synaptic.Trainer(digitNN);
    
    
    // Format the data for the neural network
    const dressData = function ( labels, images ) {
        if ( !Array.isArray(labels) || !Array.isArray(images) || labels.length !== images.length ) {
            throw 'Labels and Images must be arrays of the same length!';
        }
        
        let data = [];
        for ( let i = 0, ln = labels.length; i < ln; i++ ) {
            data.push({
                input: images[i].map(( x ) => { return utils.normalise(x, pixelMax); }),
                output: utils.convertIntToBinary(1 << labels[i], 10),
                label: labels[i]
            });
        }
        
        return data;
    };
    
    // Function to load and dress data from the specified files
    const loadData = function( labelFile, imageFile ) {
        return new Promise(( resolve, reject ) => {
            let labels, images;
            
            // Check for both pieces, and if we have them, resolve the promise
            const checkComplete = function() {
                if ( labels && images ) {
                    resolve(dressData(labels, images));
                }
            };
            
            // Load the labels
            labelLoader(labelFile).then(( loadedLabels ) => {
                labels = loadedLabels;
                checkComplete();
            });
            // Load the images
            imageLoader(imageFile).then(( loadedImages ) => {
                images = loadedImages;
                checkComplete();
            });
        });
    };
    
    // Normalise the output of the neural network, so we can compare it to the 
    //  expected result after testing
    const interpretOutput = function( output ) {
        // TODO: 
        //  1) Determine which outputs are most likely
        //  2) Translate top answer into an integer
        //  3) Return string with answer, with top three results listed with %
        let answerInt = utils.convertBinaryToInt( output.map( (x) => { return Math.round(x); } ) );
        let shifts = 0;
        while ( answerInt > 1 ) {
            answerInt = answerInt >> 1;
            shifts++;
        }
        
        return shifts;
    };
    
    
    // Loading the training data, and train the neural network
    console.log('Loading training data.');
    let iterationCount = 0;
    loadData(trainLabelFile, trainImageFile)
        .then(( trainingSet ) => {
            console.log(`Data loaded (${trainingSet.length} items), beginning neural network training.`);
            
            for ( let x = 0, ln = trainingSet.length; x < ln; x += maxSetSize ) {
                console.log(`Training set ${x} to ${x + maxSetSize} ...`);
                digitTrainer.train(trainingSet.slice(x, maxSetSize), {
                    rate: 0.1,
                    iterations: 1,
                    shuffle: true
                });
            }
            console.log('Network trained. Loading test data.');
            
            loadData(testLabelFile, testImageFile)
                .then(( testSet ) => {
                    console.log(`Test set loaded (${testSet.length} items), beginning network testing.`);
                    let output = digitTrainer.test(testSet, {});
                    console.log(`=== Test Results ===`);
                    console.log(`Time elapsed: ${output.time}ms`);
                    console.log(`Test error: ${utils.formatAsPercentage(output.error)}%`);
                });
        });
})();
