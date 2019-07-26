require(['jquery', 'ByteArray', 'BPTree'], function($, ByteArray, BPTree) {
    $(document).ready(function() {

        // test variables
        var bpArray;
        var bpObj;

        // Setup test variables
        // Note: This is ran for each test() so tests can modify bpArray without
        // effecting other test
        module('Succinct Tree' , {
            setup: function() {
                bpArray = new Uint8Array([1, 1, 1, 0, 1, 0, 1, 1 ,0, 0, 0, 1, 0,
                        1, 1, 1, 0, 1, 0, 0, 0, 0]);
                bpObj = new BPTree(bpArray);
            },

            teardown: function() {
                bpArray = null;
            }
        });

        // tests the constructor of bp tree
        test('Test BP Constructor', function() {
            // Test if rank 0 cache was initialized correctly
            var r0Cache = ByteArray.sumVal(bpArray, Uint32Array, 0);
            deepEqual(bpObj.r0Cache_, r0Cache, 'Test: rank 0 cache');

            // Test if rank 1 cache was initialized correctly
            var r1Cache = ByteArray.sumVal(bpArray, Uint32Array, 1);
            deepEqual(bpObj.r1Cache_, r1Cache, 'Test: rank 1 cache');

            // Test if select 0 cache was initialized correctly
            var s0Cache = ByteArray.seqUniqueIndx(r0Cache, Uint32Array);
            deepEqual(bpObj.s0Cache_, s0Cache, 'Test: select 0 cache');

            // Test if select 1 cached was initialized correctly
            var s1Cache = ByteArray.seqUniqueIndx(r1Cache, Uint32Array);
            deepEqual(bpObj.s1Cache_, s1Cache, 'Test: select 1 cache');
        });

        test('Test rank property', function() {
            var BIT_0 = 0, BIT_1 = 1;
            var l = bpArray.length;
            for (var i = 0; i < l; i++) {
                equal(bpObj.rank(BIT_0, i) + bpObj.rank(BIT_1, i), i + 1);
            }
        });

        test('Test select property', function() {
            var s0 = ByteArray.seqUniqueIndx(
                        ByteArray.sumVal(bpArray, Uint32Array, 0),
                        Uint32Array);
            var s1 = ByteArray.seqUniqueIndx(
                        ByteArray.sumVal(bpArray, Uint32Array, 1),
                        Uint32Array);
            var s = {0 : s0, 1: s1};
            for (var bit in s) {
                var ks = s[bit];
                var t = parseInt(bit);
                for(var k = 0; k < ks.length; k++) {
                    equal(bpObj.rank(t, bpObj.select(t, k)), k + 1);
                }
            }
        });

        test('Test excess', function() {
            var exp = [1, 2, 3, 2, 3, 2, 3, 4, 3, 2, 1, 2, 1, 2, 3, 4, 3, 4, 3,
                       2, 1, 0];
            console.log({rank0Cache: bpObj.r0Cache_,
                        rank1Cache: bpObj.r1Cache_});
            for (var i = 0; i < exp.length; i++) {
                equal(bpObj.excess_(i), exp[i]);
            }
        });

        // Note: depth should equal to excess
        test('Test depth', function() {
            var exp = [1, 2, 3, 2, 3, 2, 3, 4, 3, 2, 1, 2, 1, 2, 3, 4, 3, 4, 3,
                       2, 1, 0];
            console.log({rank0Cache: bpObj.r0Cache_,
                        rank1Cache: bpObj.r1Cache_});
            for (var i = 0; i < exp.length; i++) {
                equal(bpObj.depth(i), exp[i]);
            }
        });
    });
});