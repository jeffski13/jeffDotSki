export const FORM_SUCCESS = 'success';
export const FORM_ERROR = 'error';

export function validateFormString(str, canBeEmpty) {
	if (typeof str === 'string' && (canBeEmpty || str.length > 0)) {
		return FORM_SUCCESS;
	}
	else {
		return FORM_ERROR;
	}
}

export function validateFormStringWithCharacterMax(str, maxChars, canBeEmpty) {
    if (validateFormString(str, canBeEmpty) === FORM_SUCCESS && str.length < maxChars) {
		return FORM_SUCCESS;
	}
	else {
		return FORM_ERROR;
	}
}

export function validateFormPositiveNumber(inputNum) {
	let num = parseInt(inputNum);
	if (num && typeof num === 'number' && num > 0) {
		return FORM_SUCCESS;
	}
	else {
		return FORM_ERROR;
	}
}

export function validateFormPositiveAndLessThanOrEqualToMaximum(inputNum, maxNum) {
	if (validateFormPositiveNumber(inputNum) === FORM_SUCCESS) {
        let num = parseInt(inputNum);
        if(num <= maxNum){
            return FORM_SUCCESS;
        }
	}
    return FORM_ERROR;
}

export function validateDate(dateNum) {
	if (dateNum && dateNum > 0) {
		return FORM_SUCCESS;
	}
	else {
		return FORM_ERROR;
	}
}