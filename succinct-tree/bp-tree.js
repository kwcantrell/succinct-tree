define(['ByteArray'], function(ByteArray) {
    /**
    *
    * @class BPTree
    *
    * Initialzes a new BP tree.
    *
    * @param {Uint8Array} bp The array that represents the tree structure
    * @param {Array} names The names of each node stored in preorder
    * @param {Array} lengths The lengths of each node stored in preorder
    *
    * @return {BPTree}
    * @constructs BPTree
    */
    function BPTree(bp, names=null, lengths=null) {
        /**
         * @type {Uint8Array}
         * Used to store the structure of the tree
         */
        this.bp = bp;

        /**
         * @type {Number}
         * Number of nodes in tree
         */
        this.size = this,bp.length / 2;

        /*
         * @type {Array}
         * @private
         * stores the name of each node in preorder
         */
        this.names_ = (names) ? names : Array.of(this.size).map(function(v,i) {
                                            return "" + i;
                                        });

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

        /**
         * @type {Uint32Array}
         * @private
         * excess is used frequently so we can cache it to get a slight
         * performance boost
         */
        var eCache = [];
        for (var i = 0; i < this.bp.length; i++) {
            eCache.push((2 * this.r1Cache_[i]) - i - 1);
        }
        this.eCache_ = new Uint32Array(eCache);
    };

    /**
     *
     * Returns the number of times bit t was observed leading upto bit t
     *
     * @param{Number} t Bit value, 0 is an close paraenthesis and 1 is an
     *      open parenthesis.
     * @param{Number} i Position to evaluate
     *
     * @return{Number}
     */
    BPTree.prototype.rank = function(t, i) {
        var rCache = (t) ? this.r1Cache_ : this.r0Cache_;
        return rCache[i];
    };

    /**
    *
    * Returns the position of the kth occurance of bit t
    *
    * @param{Number} t Bit value, 0 is an close paraenthesis and 1 is an
     *      open parenthesis.
     * @param{Number} k Note k starts at 0
     *
     * @return{Number}
     */
    BPTree.prototype.select = function(t, k) {
        var sCache = (t) ? this.s1Cache_ : this.s0Cache_;
        return sCache[k];
    };

    /**
     *
     * The excess at position i is the number of 1's - 0's.
     * i.e. rank(1,i) - rank(0,i)
     *
     * @oaram{Number} i The position to calculate the excess
     *
     * @return{Number} The excess at position i
     * @private
     */
    BPTree.prototype.excess_ = function(i) {
        // need to subtract 1 since i starts at 0
        // Note: rank(1,i) - rank(0,i) = (2*(rank(1,i)) - i
        return (2 * this.r1Cache_[i]) - i - 1;
    };

    /**
     *
     * The depth of a node i in preorder
     *
     * @param{Number} i Node i in preorder
     *
     * @return{Number} Depth of node i
     */
    BPTree.prototype.depth = function(i) {
        //depth is same as excess
        return this.eCache_[i];
    };

    return BPTree;
});