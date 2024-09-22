/**
 * Custom Http Request with fetch and Typescript
 */

// METHOD ACCEPT
enum REST {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

// Custom Options Request
interface Options extends RequestInit {
    baseUrl?: string | undefined;
}

// Custom Error
class HttpError extends Error {
    status: number;
    payload: any;
    constructor({ status, payload }: { status: number; payload: any }) {
        super('Http Error');
        this.status = status;
        this.payload = payload;
    }
}

// Function Request Call API
const request = async <Response>(
    method: REST.GET | REST.POST | REST.PUT | REST.DELETE,
    url: string,
    options?: Options | undefined
) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const baseHeader = {
        'Content-Type': 'application/json',
    };

    // If `options.baseUrl` is undefined => call api in Next Server
    // If `options.baseUrl` is existed => call api on server
    const baseUrl = options?.baseUrl === undefined ? process.env.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

    // Rest Api
    const res = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers: {
            ...baseHeader,
            ...options?.headers,
        },
        body,
        method,
    });
    const payload: Response = await res.json();
    const data = {
        status: res.status,
        payload,
    };
    if (!res.ok) throw new HttpError(data);

    return data;
};

/**
 *
 * How to use:
 *  - Ex: await http.get<any>(url, options) => any response
 *  - Ex: await http.post<any>(url, body, options) => any response
 */
const http = {
    get<Response>(url: string, options?: Omit<Options, 'body'> | undefined) {
        return request<Response>(REST.GET, url, options);
    },

    post<Response>(url: string, body: any, options?: Omit<Options, 'body'> | undefined) {
        return request<Response>(REST.GET, url, { ...options, body });
    },

    put<Response>(url: string, body: any, options?: Omit<Options, 'body'> | undefined) {
        return request<Response>(REST.GET, url, { ...options, body });
    },
    delete<Response>(url: string, body: any, options?: Omit<Options, 'body'> | undefined) {
        return request<Response>(REST.GET, url, { ...options, body });
    },
};

export default http;
