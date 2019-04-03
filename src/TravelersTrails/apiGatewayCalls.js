import aws4 from "aws4";
export async function authenticatedCall(authStore) {
    const apiHost = 'me41kdv4y4.execute-api.us-east-2.amazonaws.com';
    const opts = {
        method: "GET",
        service: "execute-api",
        region: 'us-east-2',
        path: "/latest/require-auth",
        host: apiHost,
        url: `https://${apiHost}/Prod/blogsecure&id=038d18a0-f9dc-11e8-8035-f3d260395f72`
    };
    const credentials = await authStore.getCredentials();
    const { accessKeyId, secretAccessKey, sessionToken } = credentials;
    const request = aws4.sign(opts, {
        accessKeyId,
        secretAccessKey,
        sessionToken
    });
    delete request.headers.Host;
    const response = await fetch(opts.url, {
        headers: request.headers
    });
    if (response.ok) {
        return await response.json();
    } else return { message: response.statusText };
}

export async function noAuthCall(authStore) {
    const response = await fetch(`https://${apiHost}/latest/no-auth`, {
        headers: { "x-api-key": apiKey }
    });
    return await response.json();
}