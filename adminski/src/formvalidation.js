export const FORM_SUCCESS = 'success';
export const FORM_ERROR = 'error';

export function validateFormString(str) {
	if (str && str.length > 0) {
		//fire state valid action
		return FORM_SUCCESS;
	}
	else {
		//fire state invalid action
		return FORM_ERROR;
	}
}

export function validateDate(dateNum) {
	if (dateNum && dateNum > 0) {
		//fire state valid action
		return FORM_SUCCESS;
	}
	else {
		//fire state invalid action
		return FORM_ERROR;
	}
}