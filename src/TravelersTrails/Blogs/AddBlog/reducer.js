import {STORE_BLOG_DATE, STORE_BLOG_TEXT, BLOG_UPLOADING, 
    BLOG_IMAGE_SELECTED, BLOG_IMAGE_UPLOADING, BLOG_IMAGE_UPLOAD_SUCCESS, BLOG_IMAGE_UPLOAD_FAILURE} from './actions';
import moment from 'moment';
import {STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE} from '../../Network/consts';
import { LOADIPHLPAPI } from 'dns';
//default blog
const initialState = {
    text: {
        value: null,
        isValid: false
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
    else if (action.type === STORE_BLOG_TEXT) {
        //validation here
        let valid = false;
        if(action.payload !== null && action.payload !== ''){
            valid = true;
        }
        state = {
            ...state,
            text: {
                value: action.payload,
                isValid: valid
            }
        };
    }
    else if (action.type === BLOG_UPLOADING) {
        state = {
            ...state,
            network: STATUS_LOADING
        };
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
            image: imageState
        };
    }

    //overall validation for blog
    state.isValid = false;
    if(state.text.isValid && state.image.isValid && state.date.isValid){
        state.isValid = true;
    }
    return state;
}