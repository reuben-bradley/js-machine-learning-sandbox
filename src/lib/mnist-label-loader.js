const fs = require('fs');
const labelMagicNumber = 2049;

module.exports = function( fileName ) {
    // Function returns a promise, as it may take time to load all the labels
    return new Promise(( resolve, reject ) => {
        const labels = [];
        const stream = new fs.ReadStream(fileName);
        let mn, labelCount, start = 0;
        
        // When the stream is ready, start reading the labels into memory
        stream.on('readable', () => {
            let buffer = stream.read();
            if ( buffer ) {
                if ( mn !== labelMagicNumber ) {
                    mn = buffer.readInt32BE(0);
                    labelCount = buffer.readInt32BE(4);
                    start = 8;
                }
                for ( let i = start, ln = buffer.length; i < ln; i++ ) {
                    labels.push(buffer.readUInt8(i));
                }
                start = 0;
            }
        });
        
        // When we're done, resolve the promise!
        stream.on('end', () => {
            resolve(labels);
        });
        
        // Uh-oh, something went wrong!
        stream.on('error', (e) => {
            reject(e);
        });
    });
};
