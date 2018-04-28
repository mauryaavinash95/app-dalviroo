import openSocket from 'socket.io-client';
import { getCredentials } from './credentials';
import { backendUrl } from '../config/config';
export const socket = openSocket(backendUrl);

export const initConnection = () => {
    return new Promise((resolve, reject) => {
        getCredentials()
            .then((credentials) => {
                socket.on('connect', function () {
                    console.log("Connected to the server");
                    var params = credentials;
                    socket.emit('join', params, function (err) {
                        if (err) {
                            console.log("Error: ", err);
                            reject(err);
                        }
                        else {
                            console.log('No error: ');
                            resolve("Done");
                        }
                    });
                });
            })
            .catch((err) => {
                console.log("Error getting credentials for socket connection: ", err);
            });
    });
}


