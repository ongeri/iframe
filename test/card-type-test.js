/**
 * Given a string return the type of card it maps to
 * By default an input belogs to all card type
 */
var expect = require("chai").expect;
var CardType = require("../client/card-type");

describe("Card Type Checker", function(){


    describe("Empty Values match all card types ", function(){

        it("returns all the possible card types ", function(){

            var card = new CardType("");
            expect(card.length).to.equal(2);
        });
    });


    describe("All Visa Card starts with a 4 ", function(){

        it("matches when the card starts with a 4 for VISA ", function(){

            var card = CardType("411");
            expect(card.length).to.equal(1);
        
        });

        it("matches when a card starts with 5 for MasterCard ", function(){

            var card = CardType("51");
            expect(card.length).to.equal(1);
        });

        it("Does not match when a card starts with 1 ", function(){

            var card = CardType("1");
            expect(card.length).to.equal(0);
        });
    });

    it("It returns an empty array if passed a non-string ", function(){

        expect(CardType()).to.deep.equal([]);
        expect(CardType(null)).to.deep.equal([]);
        expect(CardType(true)).to.deep.equal([]);
        expect(CardType(false)).to.deep.equal([]);
        expect(CardType('magnum claud')).to.deep.equal([]);
        expect(CardType(3920342)).to.deep.equal([]);
        expect(CardType([])).to.deep.equal([]);
        expect(CardType({})).to.deep.equal([]);
    });

    describe("matches card number to issuer ", function(){

        var tests = [
            ['4', 'visa'],
            ['411', 'visa'],
            ['4111111111111111', 'visa'],
            ['4012888888881881', 'visa'],
            ['4222222222222', 'visa'],
            ['4462030000000000', 'visa'],
            ['4484070000000000', 'visa'],
            ['411111111111111111', 'visa'],
            ['4111111111111111110', 'visa'],
            ['51', 'master-card'],
            ['52', 'master-card'],
            ['53', 'master-card'],
            ['54', 'master-card'],
            ['55', 'master-card'],
            ['5555555555554444', 'master-card'],
            ['5454545454545454', 'master-card']
        ];

        tests.forEach(function(test){

            var number = test[0];
            var type = test[1];

            it("should match "+type+" for this number: "+number, function(){

                var card = CardType(number);
                expect(card).to.have.lengthOf(1);
                expect(card[0].type).to.equal(type);
            });
        });
    });
});