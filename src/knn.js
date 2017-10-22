/**
 * Inspired by Abhishek Soni's post on HackerNoon - https://hackernoon.com/machine-learning-with-javascript-part-2-da994c17d483
 * 
 * @author Reuben Bradley
 */

const KNN = require('ml-knn');
const csv = require('csvtojson');
const readline = require('readline');

const utils = require('./lib/utils');

const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Functions used in preparing the data and training the model
const getTypeSet = ( data ) => {
    let types = new Set();
    
    data.forEach(( row ) => {
        types.add(row.type);
    });
    
    return [...types];
};

const dressData = ( data ) => {
    let typesArray = getTypeSet(data);
    let input = [],
        output = [];
    
    // Split each row into data and label
    data.forEach(( row ) => {
        let rowArray;
        
        rowArray = Object.keys(row).map(( key ) => { return parseFloat(row[key]); }).slice(0, 4);
        
        input.push(rowArray);
        output.push(typesArray.indexOf(row.type));
    });
    
    return {
        input: input,
        output: output
    };
};

const calcErrorRate = ( predicted, expected ) => {
    let misses = 0;
    for ( let i = 0; i < predicted.length; i++ ) {
        if ( predicted[i] !== expected[i] ) {
            misses++;
        }
    }
    
    return utils.formatAsPercentage(misses / predicted.length);
};

const test = ( model, input, predicted ) => {
    const result = model.predict(input);
    const predictionError = calcErrorRate(result, predicted);
    console.log(`Test set size: ${input.length}`);
    console.log(`Miscalculations: ${predictionError}%`);
};

const getUserInput = ( model, types ) => {
    let temp = [];
    let variables = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
    
    const variableRecurse = ( answer ) => {
        temp.push(parseFloat(answer));
        if ( variables.length ) {
            prompt.question(variables.pop() + ': ', variableRecurse);
        }
        else {
            let prediction = model.predict(temp);
            
            console.log(`With ${temp} -- type = ${types[prediction]}`);
            inputLoop();
        }
    };
    
    const inputLoop = () => {
        prompt.question('Please select an option:\n    1. Predict custom set\n    2. Exit\n> ', ( answer ) => {
            if ( parseInt(answer) == 2 || answer.toLowerCase() === 'exit' || answer.toLowerCase() === 'q' ) {
                console.log('Quitting!');
                prompt.close();
                process.exit(0);
                return;
            }
            else if ( parseInt(answer) == 1 ) {
                // Begin collecting variable input
                prompt.question(variables.pop() + ': ', variableRecurse);
            }
            else {
                // Didn't understand the selection
                console.log('Sorry, that selection was not understood. Please select (1) or (2).');
                inputLoop();
            }
        });
    };
    inputLoop();
};


// Now we do the actual work!
(function main() {
    const csvFilePath = 'data/iris.csv';
    const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type'];
    
    let knn;

    let data = [],
        trainingSetInput = [],
        trainingSetOutput = [],
        testSetInput = [],
        testSetOutput = [];

    
    console.log('Loading dataset.');
    csv({ noheader: true, headers: names })
        .fromFile(csvFilePath)
        .on('json', (jsonObj) => {
            data.push(jsonObj);
        })
        .on('done', (error) => {
            let dressedData,
                separationSize;
            
            console.log(`Data loaded (${data.length} items).`);
            separationSize = 0.7 * data.length;
            data = utils.shuffleArray(data);
            dressedData = dressData(data);
            
            // Split the data set into training and testing chunks
            trainingSetInput = dressedData.input.slice(0, separationSize);
            trainingSetOutput = dressedData.output.slice(0, separationSize);
            testSetInput = dressedData.input.slice(separationSize);
            testSetOutput = dressedData.output.slice(separationSize);
            
            // Create and train the model
            knn = new KNN(trainingSetInput, trainingSetOutput, { k: 7 });
            console.log(`Model trained, with a set of ${trainingSetInput.length} items.`);
            
            test(knn, testSetInput, testSetOutput);
            getUserInput(knn, getTypeSet(data));
        });
})();
