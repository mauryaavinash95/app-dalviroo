import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';

export function setPredictions(productId, productName, predicted) {
    return new Promise((resolve, reject) => {
        getCredentials()
            .then((credentials) => {
                let route = backendUrl + "setpredicted";
                let options = {
                    method: "POST",
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        username: credentials.username,
                        token: credentials.token,
                        groupId: credentials.groupId,
                    }),
                    body: JSON.stringify({
                        productId, productName, predicted
                    })
                }
                fetch(route, options)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        // console.log("response is: ", responseJson);
                        resolve(responseJson);
                    })
                    .catch((err) => {
                        console.log("Error: ", err);
                        reject(err);
                    })
            })
            .catch((err) => {
                reject("Please login and try again");
            })

    })
}


