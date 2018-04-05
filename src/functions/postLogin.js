import { backendUrl } from '../config/config';

export function postLogin(username, password, groupId) {
    console.log("postinglogin as: ", username, password, groupId);
    return new Promise((resolve, reject) => {
        let route = backendUrl + "signin";
        let body = {
            username, password, groupId
        }
        let options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }
        fetch(route, options)
            .then((result) => result.json())
            .then((responseJson) => {
                console.log("Got response as : ", responseJson);
                if (responseJson.code === 200) {
                    resolve(responseJson);
                } else {
                    reject(responseJson.data);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
                reject(err);
            })
    })
}


