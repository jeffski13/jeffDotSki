export const START_EDIT_BLOG = 'START_EDIT_BLOG';
export const STORE_BLOG_DATE = 'STORE_BLOG_DATE';
export const STORE_BLOG_TITLE = 'STORE_BLOG_TITLE';
export const STORE_BLOG_TEXT = 'STORE_BLOG_TEXT';
export const BLOG_UPLOADING_SUCCESS = 'BLOG_UPLOADING_SUCCESS';
export const BLOG_UPLOADING_FAILURE = 'BLOG_UPLOADING_FAILURE';
export const BLOG_UPLOADING_FINISHED = 'BLOG_UPLOADING_FINISHED';
export const BLOG_IMAGE_SELECTED = 'BLOG_IMAGE_SELECTED';
export const START_UPLOAD_AND_BLOG_IMAGE_UPLOADING = 'START_UPLOAD_AND_BLOG_IMAGE_UPLOADING';
export const BLOG_IMAGE_UPLOAD_SUCCESS = 'BLOG_IMAGE_UPLOAD_SUCCESS';
export const BLOG_IMAGE_UPLOAD_FAILURE = 'BLOG_IMAGE_UPLOAD_FAILURE';
export const START_UPDATE_NO_IMAGE = 'START_UPDATE_NO_IMAGE';

export function startEditBlog(blogData) {
    return {
        type: START_EDIT_BLOG,
        payload: blogData //hand in all the initial information for the edit blog form
    }
}
export function storeBlogDate(blogDate) {
    return {
        type: STORE_BLOG_DATE,
        payload: blogDate
    }
}

export function storeBlogTitle(title) {
    return {
        type: STORE_BLOG_TITLE,
        payload: title
    }
}

export function storeBlogText(blogText) {
    return {
        type: STORE_BLOG_TEXT,
        payload: blogText
    }
}

export function uploadingBlogSuccess() {
    return {
        type: BLOG_UPLOADING_SUCCESS,
        payload: null
    }
}

export function uploadingBlogFailure() {
    return {
        type: BLOG_UPLOADING_FAILURE,
        payload: null
    }
}

export function uploadingBlogFinished() {
    return {
        type: BLOG_UPLOADING_FINISHED,
        payload: null
    }
}

export function blogImageSelected(imageData, imageUrl) {
    return {
        type: BLOG_IMAGE_SELECTED,
        payload: {imageUrl, imageData}
    }
}

export function uploadingImage() {
    return {
        type: START_UPLOAD_AND_BLOG_IMAGE_UPLOADING,
        payload: null
    }
}

export function uploadImageSuccess(blogImageUrl) {
    return {
        type: BLOG_IMAGE_UPLOAD_SUCCESS,
        payload: blogImageUrl
    }
}

export function uploadImageFailure() {
    return {
        type: BLOG_IMAGE_UPLOAD_FAILURE,
        payload: null
    }
}

export function startBlogUpdatedNoImage() {
    return {
        type: START_UPDATE_NO_IMAGE,
        payload: null
    }
}

