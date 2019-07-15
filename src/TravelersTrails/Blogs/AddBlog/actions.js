export const STORE_BLOG_DATE = 'STORE_BLOG_DATE';
export const STORE_BLOG_TEXT = 'STORE_BLOG_TEXT';
export const BLOG_UPLOADING = 'BLOG_UPLOADING';
export const BLOG_UPLOADING_SUCCESS = 'BLOG_UPLOADING_SUCCESS';
export const BLOG_UPLOADING_FAILURE = 'BLOG_UPLOADING_FAILURE';
export const BLOG_UPLOADING_FINISHED = 'BLOG_UPLOADING_FINISHED';
export const BLOG_IMAGE_SELECTED = 'BLOG_IMAGE_SELECTED';
export const BLOG_IMAGE_UPLOADING = 'BLOG_IMAGE_UPLOADING';
export const BLOG_IMAGE_UPLOAD_SUCCESS = 'BLOG_IMAGE_UPLOAD_SUCCESS';
export const BLOG_IMAGE_UPLOAD_FAILURE = 'BLOG_IMAGE_UPLOAD_FAILURE';

export function storeBlogDate(blogDate) {
    return {
        type: STORE_BLOG_DATE,
        payload: blogDate
    }
}

export function storeBlogText(blogText) {
    return {
        type: STORE_BLOG_TEXT,
        payload: blogText
    }
}

export function uploadingBlog() {
    return {
        type: BLOG_UPLOADING,
        payload: null
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
        type: BLOG_IMAGE_UPLOADING,
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

