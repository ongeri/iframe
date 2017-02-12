
var expect = require("chai").expect;
var Exp = require("../../client/card-validator").exp;

describe("Exp Validation ", function(){

    describe("Edge cases ", function(){

        var arr = [
            [{},{isPotentiallyValid: false,isValid: false}],
            [[],{isPotentiallyValid: false,isValid: false}],
            [false,{isPotentiallyValid: false,isValid: false}],
            [null,{isPotentiallyValid: false,isValid: false}],
            [undefined,{isPotentiallyValid: false,isValid: false}],
        ];

        runTest(arr);
    });

    describe("Valid Data Types Test ", function(){

        var arr = [
            ["",{isPotentiallyValid: true,isValid: false}],
            ["1",{isPotentiallyValid: true,isValid: false}],
            ["90",{isPotentiallyValid: false,isValid: false}],
            ["12",{isPotentiallyValid: true,isValid: false}],
            ["1a",{isPotentiallyValid: false,isValid: false}],
            ["84",{isPotentiallyValid: false,isValid: false}],
            ["1a",{isPotentiallyValid: false,isValid: false}],
        ];

        runTest(arr);
    });

    describe("Valid Data types with atleat two chars ", function(){

        var arr = [
            ["123",{isPotentiallyValid: false,isValid: false}],
            ["12/",{isPotentiallyValid: true,isValid: false}],
            ["90/",{isPotentiallyValid: false,isValid: false}],
            ["1//",{isPotentiallyValid: false,isValid: false}],
            ["1a/",{isPotentiallyValid: false,isValid: false}],
            ["012",{isPotentiallyValid: false,isValid: false}],
            ["01/",{isPotentiallyValid: true,isValid: false}],
        ];

        runTest(arr);
    });

    describe("Valid Data types with atleat three chars ", function(){

        var arr = [
            ["123a",{isPotentiallyValid: false,isValid: false}],
            ["12/a",{isPotentiallyValid: false,isValid: false}],
            ["90/3",{isPotentiallyValid: false,isValid: false}],
            ["12/1",{isPotentiallyValid: true,isValid: false}],
            ["11/4566",{isPotentiallyValid: false,isValid: false}],
            ["11/12",{isPotentiallyValid: false,isValid: false}]
        ];

        runTest(arr);
    });

    
});

function runTest(arr) {

    arr.forEach(function(item){

        var value = item[0];
        var isValid = item[1].isValid;
        var isPotentiallyValid = item[1].isPotentiallyValid;
        var actual = Exp(value);

        it("isPotentiallyValid of value "+value+" should be "+isPotentiallyValid+" ", function(){
            expect(actual.isPotentiallyValid).to.equal(isPotentiallyValid);
        });
         it("isValid of value "+value+" should be "+isValid+" ", function(){
            expect(actual.isValid).to.equal(isValid);
        });
    });
}