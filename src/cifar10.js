const synaptic = require('synaptic');

const utils = require('./lib/utils');
const imageLoader = require('./lib/cifar10-image-loader');

(function main() {
    const trainingFiles = [
        './data/cifar-10-batches-bin/data_batch_1.bin',
        './data/cifar-10-batches-bin/data_batch_2.bin',
        './data/cifar-10-batches-bin/data_batch_3.bin',
        './data/cifar-10-batches-bin/data_batch_4.bin',
        './data/cifar-10-batches-bin/data_batch_5.bin'
    ];
    const testFile = './data/cifar-10-batches-bin/test_batch.bin';
    
    const maxPixelValue = 0xff;
    const maxSetSize = 2500;
    const startTime = new Date().getTime();
    
    // Create our neural network
    const imageNN = new synaptic.Architect.Perceptron(3072, 45, 10);
    const imageTrainer = new synaptic.Trainer(imageNN);
    
    // Format the data in a way that our neural network can understand it
    const dressData = ( data ) => {
        let dataOut = [];
        let input, item;
        
        while ( item = data.shift() ) {
            input = [];
            for ( let x = 0; x < item.red.length; x++ ) {
                input.push(utils.normalise(item.red[x], maxPixelValue));
                input.push(utils.normalise(item.green[x], maxPixelValue));
                input.push(utils.normalise(item.blue[x], maxPixelValue));
            }
            dataOut.push({
                input: input,
                output: utils.convertIntToBinary(1 << item.label, 10),
                label: item.label
            });
        }
        
        return dataOut;
    };
    
    // Train the network with the given data
    const trainNetwork = ( trainingData ) => {
        for ( let x = 0, ln = trainingData.length; x < ln; x += maxSetSize ) {
            console.log(`Training set ${x} to ${x + maxSetSize} ...`);
            imageTrainer.train(dressData(trainingData.slice(x, maxSetSize)), {
                rate: 0.1,
                iterations: 1,
                shuffle: true
            });
        }
    };
    
    // Given an array of files, load each sequentially and use the provided functions
    //  with the loaded data.  Runs one final function when the list is complete.
    const loadSequential = ( fileList, successFn, completeFn ) => {
        let nextFile = fileList.shift();
        imageLoader(nextFile).then( ( imageData ) => {
            successFn(imageData);
            if ( fileList.length ) {
                loadSequential(fileList, successFn, completeFn);
            }
            else {
                completeFn();
            }
        });
    };
    
    
    // Start your engines!!
    console.log('Loading training data.');
    loadSequential(trainingFiles, ( imageData ) => {
            console.log(`Loaded ${imageData.length} items. Training ...`);
            trainNetwork(imageData);
        }, () => {
            console.log('Training complete.');
            imageLoader(testFile)
                .then(( testSet ) => {
                    console.log(`Test set loaded (${testSet.length} items), beginning network testing.`);
                    let output = imageTrainer.test(dressData(testSet), {});
                    console.log(`=== Test Results ===`);
                    console.log(`Time elapsed: ${output.time}ms`);
                    console.log(`Test error: ${utils.formatAsPercentage(output.error)}%`);
                    
                    let endTime = new Date().getTime();
                    console.log(`Total run time: ${endTime - startTime}ms`);
                    process.exit(0);
                });
    });
    
})();
