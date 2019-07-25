define(['ByteArray'], function(ByteArray) {
    /**
    *
    * @class BPTree
    *
    * Initialzes a new BP tree.
    *
    * @param {Uint8Array} bp The array that represents the tree structure
    *
    * @return {BPTree}
    * @constructs BPTree
    */
    function BPTree(bp) {
        /**
         * @type {Uint8Array}
         * Used to store the structure of the tree
         */
        this.bp = bp;

        /**
         * @type {Number}
         * Number of nodes in tree
         */
        this.length = this,bp.length / 2;

        // Initialize the select r cache arrays
        var unique = function(array) {
            var l = array.length;
            var uniArr = new Uint32Array(l);
        }

        /**
         * @type {Uint32Array}
         * @private
         * r0Cache[i] represents rank(0,i) in this.bp
         * Note: rank(0,i) = number of 0's between indices [0,i] in this.bp
         * TODO: implement a rmM tree and calculate this on the fly
         */
        this.r0Cache_ = ByteArray.sumVal(this.bp, Uint32Array,  0);

        /**
         * @type {Uint32Array}
         * @private
         * r1Cache[i] represents rank(1,i) in this.bp
         * TODO: implement a rmM tree and calculate this on the fly
         */
        this.r1Cache_ = ByteArray.sumVal(this.bp, Uint32Array, 1);

        /**
         * @type {Uint32Array}
         * @private
         * s0Cache[i] represents select(0,i) in this.bp
         * Note: select(0,i) = the index of the ith 0 in this.bp
         * TODO: implement a rmM tree and calculate this on the fly
         */
        this.s0Cache_ = ByteArray.seqUniqueIndx(this.r0Cache_, Uint32Array);

        /**
         * @type {Uint32Array}
         * @private
         * s1Cache[i] represents select(1,i) in this.bp
         * TODO: implement a rmM tree and calculate this on the fly
         */
        this.s1Cache_ = ByteArray.seqUniqueIndx(this.r1Cache_, Uint32Array);


    };

    return BPTree;
  });