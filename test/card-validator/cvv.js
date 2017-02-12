var expect = require("chai").expect;
var cvv = require("../../client/card-validator").cvv;

describe("cvv validation", function(){

    it(":potentially valid cvv", function(){
        var arr = [
            ['', {isValid: false, isPotentiallyValid: true}],
            ['1', {isValid: false, isPotentiallyValid: true}],
            ['1', {isValid: false, isPotentiallyValid: true}, [3, 4]],
            ['1', {isValid: false, isPotentiallyValid: true}, [4, 3]],
            ['12', {isValid: false, isPotentiallyValid: true}],
            ['123', {isValid: false, isPotentiallyValid: true}, 4]
        ];
        runTest(arr);
    });

    it(": valid length strings ", function(){
        var arr = [
            ['000', {isValid: true, isPotentiallyValid: true}],
            ['0000', {isValid: true, isPotentiallyValid: true}, 4],
            ['123', {isValid: true, isPotentiallyValid: true}],
            ['1234', {isValid: true, isPotentiallyValid: true}, 4],
            ['1234', {isValid: true, isPotentiallyValid: true}, [3, 4]],
            ['123', {isValid: true, isPotentiallyValid: true}, [3, 4]]
        ];

        runTest(arr);
    });

    it(":edge cases ",function(){

        var arr = [
            [0, {isValid: false, isPotentiallyValid: false}],
            [123, {isValid: false, isPotentiallyValid: false}],
            [1234, {isValid: false, isPotentiallyValid: false}],
            [-1234, {isValid: false, isPotentiallyValid: false}],
            [-10, {isValid: false, isPotentiallyValid: false}],
            [0 / 0, {isValid: false, isPotentiallyValid: false}],
            [Infinity, {isValid: false, isPotentiallyValid: false}],
            [null, {isValid: false, isPotentiallyValid: false}],
            [[], {isValid: false, isPotentiallyValid: false}],
            [{}, {isValid: false, isPotentiallyValid: false}]
        ];

        runTest(arr);
    });
});

function runTest(arr) {
    arr.forEach(function(item){
        
        var value = item[0];
        var isValid = item[1].isValid;
        var isPValid = item[1].isPotentiallyValid;
        var cvvArr = item[2]
        var actual = cvv(value, cvvArr);

        expect(actual.isValid).to.equal(isValid);
        expect(actual.isPotentiallyValid).to.equal(isPValid);
    });
}