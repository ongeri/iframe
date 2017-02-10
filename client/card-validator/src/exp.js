


var verification = function(isPotentiallyValid, isValid){
    return {
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };
};

var Exp = function(value) {
    console.log("validating the exp field "+value);

    if(typeof value !== 'string') {
        console.log("exp is not a string");
        return verification(false, false);
    }

    if(value.length == 0) { 

        console.log("exp is empty");
        return verification(false, false); 
    }

    if(value.length <= 2) {
        console.log("month is 1-2");
         if(!/^\d*$/.test(value)) return verification(false, false); 
         return verification(true, false); 
    }

    var month = value.substring(0, 2);
    var year = value.substring(3);
    console.log("month "+month);
    console.log("year "+year);

    //if there is any character
    if(month.length > 0 && !/^\d*$/.test(month)) {
        console.log("month is not all digits ");
        return verification(false, false); 
    }
    if(year.length > 0 && !/^\d*$/.test(year)) {
        console.log("year is not all digits ");
        return verification(false, false); 
    }

    if(year.length < 2) {
        console.log("no year so valid");
        return verification(true, false); 
    }

    var presentDate = new Date();
    var presentMonth = presentDate.getMonth()+1;
    var presentYear = presentDate.getYear();
    console.log("present month "+presentMonth);
    console.log("present year "+presentYear);

    presentMonth = presentMonth.length == 1 ? "0"+presentMonth : presentMonth;
    presentYear %= 100;

    if(year < presentYear) {
        console.log("year is in the past");
        return verification(false, false); 
    }
    else {

        if(parseInt(month) >= 1 && parseInt(month) <= 12 && parseInt(month) >= parseInt(presentMonth)) {
            console.log("month and year are valid");
            return verification(true, true); 
        }
        else {
            console.log("month and year are Invalid");
            return verification(false, false); 
        }

    }
    
}

module.exports = Exp;