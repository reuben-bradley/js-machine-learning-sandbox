const fs = require('fs');

const pixelCount = 3072;
const channelCount = 1024;

module.exports = function( fileName ) {
    // Function returns a promise, as it may take time to load all the image information
    return new Promise(( resolve, reject ) => {
        const pixelData = [];
        const stream = new fs.ReadStream(fileName);
        let imagePixels = [];
        let label = -1;
        let bytesRead = 0;
        
        // When the stream is ready, start reading the labels into memory
        stream.on('readable', () => {
            let buffer = stream.read();
            if ( buffer ) {
                for ( let i = 0, ln = buffer.length; i < ln; i++ ) {
                    bytesRead++;
                    if ( label < 0 ) {
                        label = buffer.readUInt8(i);
                        continue;
                    }
                    
                    imagePixels.push(buffer.readUInt8(i));
                    if ( imagePixels.length == pixelCount ) {
                        pixelData.push({
                            label: label,
                            red: imagePixels.slice(0, channelCount),
                            green: imagePixels.slice(channelCount, channelCount * 2),
                            blue: imagePixels.slice(channelCount * 2)
                        });
                        imagePixels = [];
                        label = -1;
                    }
                }
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
