require(['jquery', 'ByteArray', 'BPTree'], function($, ByteArray, BPTree) {
    $(document).ready(function() {

        // test variables
        var bpArray;

        module('Succinct Tree' , {
            setup: function() {
                bpArray = new Uint8Array([1, 1, 1, 0, 1, 0, 1, 1 ,0, 0, 0, 1, 0, 1, 1,
                        1, 0, 1, 0, 0, 0, 0]);
            },

            teardown: function() {
                bpArray = null;
            }
        });

        // tests the constructor of bp tree
        test('Test BP Constructor', function() {
            var bpObj = new BPTree(bpArray);

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
        });
    });
});