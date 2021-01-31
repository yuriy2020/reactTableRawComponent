export const myfetch = (api, method, settings) => {
    const requestOptions = {
        method,
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            Accept: "application/json",
        },
        body: JSON.stringify(settings),
    }
    return fetch(api, requestOptions)
}