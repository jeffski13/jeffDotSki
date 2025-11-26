export const ENV = {
    DEV: 'development',
    PROD: 'prod',
}

export const getEnv = (): string => {
    if(process.env.NODE_ENV) {
        return process.env.NODE_ENV;
    }
    //assume production
    return ENV.PROD;
}