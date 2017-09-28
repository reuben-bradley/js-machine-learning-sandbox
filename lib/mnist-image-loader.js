const fs = require('fs');
const imageMagicNumber = 2051;

module.exports = function( fileName ) {
    // Function returns a promise, as it may take time to load all the image information
    return new Promise(( resolve, reject ) => {
        const pixelData = [];
        const stream = new fs.ReadStream(fileName);
        let imagePixels = [];
        let mn, imageCount, rowCount, colCount, pixelCount, start = 0;
        
        // When the stream is ready, start reading the labels into memory
        stream.on('readable', () => {
            let buffer = stream.read();
            if ( buffer ) {
                if ( mn !== imageMagicNumber ) {
                    mn = buffer.readInt32BE(0);
                    imageCount = buffer.readInt32BE(4);
                    rowCount = buffer.readInt32BE(8);
                    colCount = buffer.readInt32BE(12);
                    pixelCount = rowCount * colCount;
                    start = 16;
                }
                for ( let i = start, ln = buffer.length; i < ln; i++ ) {
                    imagePixels.push(buffer.readUInt8(i));
                    if ( imagePixels.length == pixelCount ) {
                        pixelData.push(imagePixels);
                        imagePixels = [];
                    }
                }
                start = 0;
            }
        });
        
        // When we're done, resolve the promise!
        stream.on('end', () => {
            resolve(pixelData);
        });
        
        // Uh-oh, something went wrong!
        stream.on('error', (e) => {
            reject(e);
        });
    });
};
