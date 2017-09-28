
const Utils = {
    /**
     * Shuffle the elements in a given array.
     * 
     * @param Array arr
     * @return Array
     */
    shuffleArray: function( arr ) {
        // KFY shuffle algorithm - start at the end, pick a random element, 
        //  and swap; continue until we hit the start.
        for ( let i = arr.length - 1; i > 0; i-- ) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        
        return arr;
    },
    /**
     * Convert a given integer into an array representing the integer in binary,
     *  in the specified number of bits.
     * 
     * @param Int integer
     * @param Int bytesize
     * @return Array
     */
    convertIntToBinary: function( integer, bytesize = 8 ) {
        // Make sure we're working with an integer type
        integer = parseInt(integer) || 0;
        let binary = integer.toString(2);
        
        while ( binary.length < bytesize ) {
            // Pad zeros on the left if needed
            binary = 0 + binary;
        }
        if ( binary.length > bytesize ) {
            // Trim down to the given bytesize if needed
            binary = binary.slice(-bytesize);
        }
        
        return Utils.convertStringToArray(binary, { mapFn: (x) => { return parseInt(x); } });
    },
    /**
     * Take a binary array or string, and convert it to an integer.
     * 
     * @param Array|String binary
     * @return Int
     */
    convertBinaryToInt: function( binary ) {
        // Make sure we're working with a string type
        if ( Array.isArray(binary) ) {
            binary = binary.join('');
        }
        return ( parseInt(binary, 2) || 0 );
    },
    /**
     * Split a given string into an array of elements, based on the options provided.
     *  Options:
     *      - delim: Character to split the string; defaults to '', splitting each character
     *      - mapFn: Function to call on each resulting element of the array
     *
     * @param String stringIn
     * @param Object options
     * @return Array
     */
    convertStringToArray: function( stringIn, options = {} ) {
        const emptyFn = (x) => { return x; };
        options.delim = ( options.delim || '' );
        options.mapFn = ( options.mapFn || emptyFn );
        //console.log(`Converting "${stringIn.toString().split(options.delim)}"`);
        return stringIn.toString().split(options.delim).map(options.mapFn);
    },
    /**
     * Simple function to normalise a value between 0 and 1
     * 
     * @param Int|Float value
     * @param Int|Float max
     * @return Float
     */
    normalise: function( value, max ) {
        return ( value / max );
    },
    /**
     * Take the given float and return a percentage rounded to the given number 
     *  of decimal places (default of two).
     * 
     * @param Int|Float value
     * @param Int decimals
     * @return Int|Float
     */
    formatAsPercentage: function( value, decimals = 2 ) {
        decimals = ( decimals >= 0 ) ? decimals : 0;
        let tens = Math.pow(10, decimals);
        
        return Math.round( value * 100 * tens ) / tens;
    }
};

module.exports = Utils;
