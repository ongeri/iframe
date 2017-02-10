


var verification = function(isPotentiallyValid, isValid){
    return {
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };
};

var Exp = function(value) {
    console.log("validating the exmp field "+value);

    if(typeof value !== 'string') {
        return verification(false, false);
    }

    if(value.length == 0) { 

        return verification(false, false); 
    }

    if(value.length <= 2) {
         if(!/^\d*$/.test(value)) return verification(false, false); 
         return verification(true, false); 
    }

    var month = value.substring(0, 2);
    var year = value.substring(3);

    //if there is any character
    if(month.length > 0 && !/^\d*$/.test(month)) {
        return verification(false, false); 
    }
    if(year.length > 0 && !/^\d*$/.test(year)) {
        return verification(false, false); 
    }

    if(year.length < 2) {
        return verification(true, false); 
    }

    var presentDate = new Date();
    var presentMonth = presentDate.getMonth();
    var presentYear = presentDate.getYear();

    presentMonth = presentMonth.length == 1 ? "0"+presentMonth : presentMonth;
    presentYear %= 100;

    if(year < presentYear) {
        return verification(false, false); 
    }
    else {

        if(parseInt(month) >= 1 && parseInt(month) < 12 && parseInt(month) >= parseInt(presentMonth)) {
            return verification(true, true); 
        }
        else {
            return verification(false, false); 
        }

    }
    
}

module.exports = Exp;