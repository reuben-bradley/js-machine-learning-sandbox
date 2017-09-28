const ml = require('ml-regression');
const csv = require('csvtojson');
const readline = require('readline');   // Built-in node module

const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Functions used to load data and interpret model output
const dressData = ( data ) => {
    let x = [],
        y = [];
    
    data.forEach(( row ) => {
        x.push(parseFloat(row.Radio));
        y.push(parseFloat(row.Sales));
    });
    
    return {
        input: x,
        output: y
    };
};

const createModel = ( trainingInput, trainingOutput ) => {
    return new ml.SLR(trainingInput, trainingOutput);
};

const predictOutput = ( model ) => {
    prompt.question('Enter input for prediction (or "q" to exit): ', ( answer ) => {
        if ( answer === 'q' ) {
            console.log('Quitting!');
            prompt.close();
            return;
        }
        answer = parseFloat(answer) || 0;
        
        let result = model.predict(answer);
        console.log(`At x = ${answer}, y = ${result}`);
        predictOutput( model );
    });
};


// Now for the bulk of the work!
(function main() {
    const csvFilePath = './data/advertising.csv';
    let csvData = [];
    let regressionModel;

    console.log('Loading data.');
    csv().fromFile(csvFilePath)
        .on('json', ( jsonObj ) => {
            csvData.push(jsonObj);
        })
        .on('done', () => {
            console.log(`Data loaded (${csvData.length} items).`);
            let dressedData = dressData(csvData);
            console.log('Model created and trained.');
            regressionModel = createModel(dressedData.input, dressedData.output);
            predictOutput(regressionModel);
        });

})();
