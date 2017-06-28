function NumKeysOnly(eventargs) {
    // delete	  46
    // '9'        57
    // '/'        47 
    // tab	       9
    // insert     45
    // backspace   8        
    var noGood = false;
    var thisString = eventargs.target || eventargs.srcElement; //#: change
    var keyCode = eventargs.which || eventargs.keyCode; //#: Add
    var evt = eventargs || window.event;
    var str = jtrim(thisString.value);

    var kcaretPos = doGetCaretPosition(thisString);
    var kinputvalue = $(thisString).val();
    var kleftpart = kinputvalue.substr(0, kcaretPos);
    var krighttpart = kinputvalue.substr(kcaretPos);
    var l1 = kleftpart;
    var r1 = krighttpart;
    var dotCtr = 0;
    if (keyCode != 45 && keyCode != 8 && (keyCode != 46) && (keyCode < 48 || keyCode > 57)) {
        noGood = true;
    }
    if (str.indexOf('.') >= 0) {
        // check position of '.', if caret is next to '.' allow only following keycode 
        var dotIndex = str.indexOf('.');
        // Custom formating for decimal places 
        if (kcaretPos - 1 == dotIndex) { // user entering data next to '.' (decimal values)
            var decimalVal = 0;            
            switch (keyCode) {
                case 50:
                    decimalVal = '25';
                    $(thisString).val(kinputvalue + decimalVal);
                    noGood = true;
                    break;                                       
                case 53:
                    decimalVal = '50';
                    $(thisString).val(kinputvalue + decimalVal);
                    noGood = true;                    
                    break;
                case 55:
                    decimalVal = '75';
                    $(thisString).val(kinputvalue + decimalVal);
                    noGood = true;                    
                    break;
                default:
                    // This mean no valid keyCode 
                    noGood = true;
                    return false;                    
            }
        }
        else {
            // check if '.' is availabe with 2 decimal place             
            for (var j = 0; j < str.length; j++) {
                if (dotCtr == 1)
                    i++;
                if (str.charAt(j) == ".") {
                    dotCtr = dotCtr + 1;
                    var i = 0;
                }
            }
            if (krighttpart.length == 0 && i == 2 && keyCode != 8) { // no elemnt at right side , also check it's not backspace
                noGood = true;
            }
        }
    }
    if (keyCode == 46) {
        // now check kcaretPos index is 0 
        // Preappend 0 & remove rest of the value
        if (kcaretPos == 0) {
            $(thisString).val('0');
        }
        else {
            // this check for any existing .
            if ((str) && (str.indexOf('.') >= 0)) {
                noGood = true;
            }
        }

    }
    if (noGood) {
        
        if (keyCode == '\u0009' || keyCode == 9 || keyCode == '9') {
            return true;
        }
        stopPropagation(evt);
        return false;
    }
};

function stopPropagation(evt) {
    if (typeof evt.stopPropagation == "function") {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
    if (typeof evt.preventDefault == "function") {
        evt.preventDefault();
    }
    else { evt.returnValue = false }
};

function watermark(inputId, text) {
    console.log("watermark");
    var inputBox = document.getElementById(inputId);
    if (inputBox.value.length > 0) {
        if (inputBox.value == text)
            inputBox.value = '';
    }
    else
        inputBox.value = text;
}

