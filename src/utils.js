import { OPEN_CAGE_DATA_AUTH_TOKEN } from "./api-constants";

export function forwardSearchLocation(searchVal) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchVal)}&language=en-US&key=${OPEN_CAGE_DATA_AUTH_TOKEN}`)
        .then(response => response.json());
}