import { backendUrl } from '../config/config';

export function postSignup(username, email, password, groupId) {
    console.log("postingSignup as: ", username, password), groupId;
    return new Promise((resolve, reject) => {
        let route = backendUrl + "signup";
        let body = {
            username, email, password, groupId
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
                    reject(responseJson.message);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
                reject(err);
            })
    })
}


