import {STORE_BLOG_DATE, STORE_BLOG_TEXT, STORE_BLOG_TITLE,
    BLOG_UPLOADING, BLOG_UPLOADING_FAILURE, BLOG_UPLOADING_SUCCESS, BLOG_UPLOADING_FINISHED,
    BLOG_IMAGE_SELECTED, BLOG_IMAGE_UPLOADING, BLOG_IMAGE_UPLOAD_SUCCESS, BLOG_IMAGE_UPLOAD_FAILURE} from './actions';
import moment from 'moment';
import {STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE} from '../../Network/consts';
import { LOADIPHLPAPI } from 'dns';
//default blog
const initialState = {
    title: {
        value: null,
        isValid: true
    },
    text: {
        value: null,
        rawValue: null,
        isValid: true
    },
    date: {
        value: moment(),
        isValid: true //only valid because we are starting on todays date
    },
    image: {
        uploadedUrl: null,
        valueImageUrlLocal: null,
        valueImageData: null,
        isValid: false,
        network: null
    },
    isValid: false,
    network: null
};

export default (state = initialState, action) => {
    if (action.type === STORE_BLOG_DATE) {
        //validation here
        let valid = false;
        if(action.payload.toDate() < moment().toDate()) {
            valid = true;
        }
        state = {
            ...state,
            date: {
                value: action.payload,
                isValid: valid
            }
        };
    }
    else if (action.type === STORE_BLOG_TITLE) {
        //validation here
        let valid = false;
        if(action.payload !== null && action.payload !== ''){
            valid = true;
        }
        state = {
            ...state,
            title: {
                value: action.payload,
                isValid: valid
            }
        };
    }
    else if (action.type === STORE_BLOG_TEXT) {
        //validation here
        let valid = false;
        let sanitizedTextArray;
        if(action.payload !== null){
            //store the text user entered and 
            sanitizedTextArray = action.payload.split('\n');
            //filter out empty text (empty string will be present if user used multiple carriage returns)
            sanitizedTextArray = sanitizedTextArray.filter(str => str !== '');

            if(sanitizedTextArray !== ''){
                valid = true;
            }
        }
        state = {
            ...state,
            text: {
                value: sanitizedTextArray,
                isValid: valid,
                rawValue: action.payload,
            }
        };
    }
    else if (action.type === BLOG_UPLOADING) {
        state = {
            ...state,
            network: STATUS_LOADING
        };
    }
    else if (action.type === BLOG_UPLOADING_SUCCESS) {
        state = {
            ...state,
            network: STATUS_SUCCESS
        };
    }
    else if (action.type === BLOG_UPLOADING_FAILURE) {
        state = {
            ...state,
            network: STATUS_FAILURE
        };
    }
    else if (action.type === BLOG_UPLOADING_FINISHED) {
        state = initialState;
    }
    else if (action.type === BLOG_IMAGE_SELECTED) {
        let imageState = state.image;
        imageState.valueImageData = action.payload.imageData;
        imageState.valueImageUrlLocal = action.payload.imageUrl;
        
        imageState.isValid = false;
        if(action.payload.imageData && action.payload.imageUrl){
            imageState.isValid = true;
        }
        state = {
            ...state,
            image: imageState
        };
    }
    else if (action.type === BLOG_IMAGE_UPLOADING) {
        let imageState = state.image;
        imageState.network = STATUS_LOADING;
        state = {
            ...state,
            network: STATUS_LOADING,
            image: imageState
        };
    }
    else if (action.type === BLOG_IMAGE_UPLOAD_SUCCESS) {
        let imageState = state.image;
        imageState.network = STATUS_SUCCESS;
        imageState.uploadedUrl = action.payload;
        state = {
            ...state,
            image: imageState
        };
    }
    else if (action.type === BLOG_IMAGE_UPLOAD_FAILURE) {
        let imageState = state.image;
        imageState.network = STATUS_FAILURE;
        state = {
            ...state,
            network: STATUS_FAILURE,
            image: imageState
        };
    }

    //overall validation for blog
    state.isValid = false;
    if(state.text.isValid && state.title.isValid && state.image.isValid && state.date.isValid){
        state.isValid = true;
    }
    return state;
}