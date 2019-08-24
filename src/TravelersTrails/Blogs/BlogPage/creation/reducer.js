import {
    START_EDIT_BLOG,
    STORE_BLOG_DATE, STORE_BLOG_TEXT, STORE_BLOG_TITLE,
    BLOG_UPLOADING_FAILURE, BLOG_UPLOADING_SUCCESS, BLOG_UPLOADING_FINISHED,
    BLOG_IMAGE_SELECTED, START_UPLOAD_AND_BLOG_IMAGE_UPLOADING, BLOG_IMAGE_UPLOAD_SUCCESS, BLOG_IMAGE_UPLOAD_FAILURE,
    START_UPDATE_NO_IMAGE
} from './actions';
import moment from 'moment';
import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from '../../../Network/consts';

//default blog
const initialState = {
    isEdittingBlog: false,
    title: {
        value: '',
        isValid: true
    },
    text: {
        value: [],
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
    network: null,
    id: null,
    uploadAttempt: 0 //a little hack so we can get "new" versions of components
};

const sanitizedTextForBlog = textArray => {
    let sanitizedTextArray = textArray.split('\n');
    //filter out empty text (empty string will be present if user used multiple carriage returns)
    sanitizedTextArray = sanitizedTextArray.filter(str => str !== '');
    return textArray;
};

const isTextForBlogValid = sanitizedBlogText => {
    if (sanitizedBlogText !== ''  //question of the day: do we need this?
        && sanitizedBlogText.length > 0) {
        return true;
    }
    return false;
};

const isTitleValid = title => {
    if (typeof title !== 'undefined' && title !== null && title !== '') {
        return true;
    }
    return false;
};

const isUploadedImagUrlValid = imageUrl => {
    if (imageUrl !== null && imageUrl !== '') {
        return true;
    }
    return false;
};

export default (state = initialState, action) => {
    if (action.type === START_EDIT_BLOG) {
        console.log('editing action: ', action.payload);
        console.log('title: ', action.payload.title);
        // recreate raw text for the text input form
        let rawText = '';
        action.payload.blogContent.forEach(nextContent => {
            if (nextContent.text) {
                rawText += nextContent.text + '\n'
            }
        });
        const isEditBlogTitleValid = isTitleValid(action.payload.title);
        const isEditBlogTextValid = isTextForBlogValid(action.payload.blogContent);
        const isEditBlogUploadedImageUrlValid = isUploadedImagUrlValid(action.payload.titleImageUrl);
        state = {
            ...state,
            title: {
                value: action.payload.title,
                isValid: isEditBlogTitleValid
            },
            text: {
                value: action.payload.blogContent,
                isValid: isEditBlogTextValid,
                rawValue: rawText,
            },
            date: {
                value: moment(action.payload.date * 1000),
                isValid: true
            },
            image: {
                uploadedUrl: action.payload.titleImageUrl,
                valueImageUrlLocal: null,
                valueImageData: null,
                isValid: isEditBlogUploadedImageUrlValid,
            },
            isValid: isEditBlogTitleValid && isEditBlogTextValid && isEditBlogUploadedImageUrlValid, //add anything in the future that needs to be validated,
            id: action.payload.id,
            isEdittingBlog: true
        };
    }
    else if (action.type === STORE_BLOG_DATE) {
        //validation here
        let valid = false;
        if (action.payload.toDate() < moment().toDate()) {
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
        
        state = {
            ...state,
            title: {
                value: action.payload,
                isValid: isTitleValid(action.payload)
            }
        };
    }
    else if (action.type === STORE_BLOG_TEXT) {
        //validation here
        let sanitizedTextArray = '';
        if (action.payload !== null) {
            //store the text user entered and 
            sanitizedTextArray = sanitizedTextForBlog(action.payload);
        }
        state = {
            ...state,
            text: {
                value: sanitizedTextArray,
                isValid: isTextForBlogValid(sanitizedTextArray),
                rawValue: action.payload,
            }
        };
    }
    else if (action.type === BLOG_UPLOADING_SUCCESS) {
        state = {
            ...initialState, //if we completely succeed we want to reset this
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
        
        //when editting we will start with an uploaded url. If we are changing the pic, we need to X that data in preparation for the new image
        imageState.uploadedUrl = null;
        if (action.payload.imageData && action.payload.imageUrl) {
            imageState.isValid = true;
        }
        state = {
            ...state,
            image: imageState
        };
    }
    else if (action.type === START_UPLOAD_AND_BLOG_IMAGE_UPLOADING) {
        let imageState = state.image;
        imageState.network = STATUS_LOADING;
        state = {
            ...state,
            network: STATUS_LOADING,
            image: imageState,
            uploadAttempt: state.uploadAttempt + 1
        };
    }
    else if (action.type === START_UPDATE_NO_IMAGE) {
        state = {
            ...state,
            network: STATUS_LOADING,
            uploadAttempt: state.uploadAttempt + 1
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
    if (state.text.isValid && state.title.isValid && state.image.isValid && state.date.isValid) {
        state.isValid = true;
    }
    return state;
}