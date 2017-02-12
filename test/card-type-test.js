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

            var card = new CardType("411");
            expect(card.length).to.equal(1);
        
        });

        it("matches when a card starts with 5 for MasterCard ", function(){

            var card = new CardType("51");
            expect(card.length).to.equal(1);
        });

        it("Does not match when a card starts with 1 ", function(){

            var card = new CardType("1");
            expect(card.length).to.equal(0);
        });
    });
});