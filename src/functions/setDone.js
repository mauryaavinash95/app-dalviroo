import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';

export function setDone(order) {
    return new Promise((resolve, reject) => {
        getCredentials()
            .then((credentials) => {
                console.log("Credentials are: ", credentials);
                let route = backendUrl + "done";
                let options = {
                    method: "POST",
                    body: JSON.stringify({
                        productName: order.productName,
                        productId: order.productId
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        username: credentials.username,
                        token: credentials.token,
                        groupId: credentials.groupId,
                    }),
                }
                fetch(route, options)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("response is: ", responseJson);
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


