var expect = require("chai").expect;
var Exp = require("../../client/card-validator").pin;

describe("pin", function(){

    describe("partial pin", function(){

        var arr = [

            ["", {isPotentiallyValid: true, isValid: false}],
            ["1", {isPotentiallyValid: true, isValid: false}],
            ["12", {isPotentiallyValid: true, isValid: false}],
            ["123", {isPotentiallyValid: true, isValid: false}],
            ["1234", {isPotentiallyValid: true, isValid: true}]

        ];

        runTest(arr);
    });

    describe("edge cases for Pin Validation ", function(){
        var arr = [
            [true, {isPotentiallyValid: false, isValid: false}],
            [false, {isPotentiallyValid: false, isValid: false}],
            [[], {isPotentiallyValid: false, isValid: false}],
            [{}, {isPotentiallyValid: false, isValid: false}],
            [null, {isPotentiallyValid: false, isValid: false}],
            [undefined, {isPotentiallyValid: false, isValid: false}],
            ["12aw", {isPotentiallyValid: false, isValid: false}]

        ];

        runTest(arr);
    });
});

function runTest(arr) {

    arr.forEach(function(item){

        var value = item[0];
        var isValid = item[1].isValid;
        var isPValid = item[1].isPotentiallyValid;
        var actual = Exp(value);

        it("isPotentiallyValid for "+value+" should be "+isPValid, function(){
            expect(actual.isPotentiallyValid).to.equal(isPValid);
        });
        it("isValid for "+value+" should be "+isValid, function(){
            expect(actual.isValid).to.equal(isValid);
        });
    });
}