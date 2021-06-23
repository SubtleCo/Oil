import { userTokenStorageKey } from "./auth/authSettings";

export const apiHeaders = () => {
    return {
        "Content-Type": "application/json",
        "Authorization": `Token ${sessionStorage.getItem(userTokenStorageKey)}`
    }
}

export const apiSettings = {
    baseUrl: "https://oil-server.herokuapp.com"
}
