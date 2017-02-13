


var verification = function(isPotentiallyValid, isValid){
    return {
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };
};

var Exp = function(value) {

    if(typeof value !== 'string') {
        return verification(false, false);
    }

    if(value.length == 0) { 

        return verification(true, false); 
    }

    if(value.charAt(0) != '0' && value.charAt(0) != '1' ){
        return verification(false, false);
    }

    if(value.length <= 2) {
         if(!/^\d*$/.test(value) ) return verification(false, false); 
         return verification(true, false); 
    }

    var month = value.substring(0, 2);
    var year = value.substring(3);
    

    if(value.charAt(2) !== '/') {
        return verification(false, false);
    }

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
    else if(year.length > 2) {
        return verification(false, false);
    }

    var presentDate = new Date();
    var presentMonth = presentDate.getMonth()+1;
    var presentYear = presentDate.getYear();
    

    presentMonth = presentMonth.length == 1 ? "0"+presentMonth : presentMonth;
    presentYear %= 100;

    if(year < presentYear) {
        return verification(false, false); 
    }
    else if(year > presentYear) {
        return verification(true, true);
    }
    else {

        if(parseInt(month) >= 1 && parseInt(month) <= 12 && parseInt(month) >= parseInt(presentMonth)) {
            return verification(true, true); 
        }
        else {
            return verification(false, false); 
        }

    }
    
}

module.exports = Exp;