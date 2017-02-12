/**
 * PAN validator test
 */

var expect = require("chai").expect;
var pan = require("../../client/card-validator").pan;
var CardType = require("../../client/card-type");

describe("Prefix Card types ", function(){

    var arr = [

        ['',{card: null, isPotentiallyValid: true, isValid: false}],
      ['4',{card: 'visa', isPotentiallyValid: true, isValid: false}],
      ['41',{card: 'visa', isPotentiallyValid: true, isValid: false}],
      ['411',{card: 'visa', isPotentiallyValid: true, isValid: false}],
      ['',{card: null, isPotentiallyValid: true, isValid: false}],
      ['x',{card: null, isPotentiallyValid: false, isValid: false}],
      ['123',{card: null, isPotentiallyValid: false, isValid: false}]
    ];


    runTest(arr);

});

describe('MasterCard', function () {
    runTest([
      ['55555555',
        {card: 'master-card', isPotentiallyValid: true, isValid: false}],
      ['5555555555554444',
        {card: 'master-card', isPotentiallyValid: true, isValid: true}],
      ['5555555555554446',
        {card: 'master-card', isPotentiallyValid: false, isValid: false}]
    ]);
  });

  describe("edge cases", function(){
      runTest([
      ['',
        {card: null, isPotentiallyValid: true, isValid: false}],
      ['foobar',
        {card: null, isPotentiallyValid: false, isValid: false}],
      [{},
        {card: null, isPotentiallyValid: false, isValid: false}],
      [[],
        {card: null, isPotentiallyValid: false, isValid: false}],
      ['32908234',
        {card: null, isPotentiallyValid: false, isValid: false}],
      [32908234,
        {card: null, isPotentiallyValid: false, isValid: false}],
      [4111111111111111,
        {card: 'visa', isPotentiallyValid: true, isValid: true}],
      [true,
        {card: null, isPotentiallyValid: false, isValid: false}],
      [false,
        {card: null, isPotentiallyValid: false, isValid: false}]
    ]);
  });

function runTest(arr){

    arr.forEach(function(item){

        var number = item[0];
        var data = item[1];
        var actual = pan(number);

        it("Should have a card type of "+data.card+" for "+number, function(){
            if(data.card) {
                expect(actual.card.type).to.equal(data.card);
            }
            else {
                expect(actual.card).to.equal(null);
            }
        });

        it('isPotentiallyValid: is ' + data.isPotentiallyValid + ' for ' + number, function () {
            expect(actual.isPotentiallyValid).to.equal(data.isPotentiallyValid);
        });
        it('valid: is ' + data.isValid + ' for ' + number, function () {
            expect(actual.isValid).to.equal(data.isValid);
        });

    });
};

