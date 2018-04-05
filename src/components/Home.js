import React from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Autosuggest from 'react-autosuggest';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, } from 'material-ui/Table';
import moment from 'moment';

import { initConnection, socket } from '../functions/socketConnect';
import { getCredentials } from '../functions/credentials'

import Header from './Header';
import { fetchOrders } from '../functions/fetchOrders';
import { setDone } from '../functions/setDone';
import '../styles/home.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            responseRecieved: false,
            groupId: 0,
        }
        this.fetchOrders = fetchOrders;
        this.setDone = setDone;
    }

    showError(error) {
        this.setState({
            error
        }, () => {
            setTimeout(() => {
                this.setState({
                    error: null,
                })
            }, 10000);
        })
    }

    componentWillMount() {
        this.fetchOrders()
            .then((responseJson) => {
                // console.log(responseJson);
                this.setState({
                    orders: responseJson.data,
                    responseRecieved: true
                })
                return null;
            })
            .then(() => {
                return getCredentials()
            })
            .then((response) => {
                this.setState({
                    groupId: response.groupId
                })
            })
            .catch((err) => {
                console.log("Error is: ", err);
            });

        initConnection();

        socket.on('update', (message) => this.handleUpdateData(message));
    }

    handleUpdateData(message) {
        let newOrders = [];
        if (message && message.code === 200) {
            message.data.forEach((order) => {
                if (order.groupId === this.state.groupId) {
                    newOrders.push(order)
                }
            });
            this.setState({
                orders: newOrders,
                responseRecieved: true
            })
        }
    }

    lastFormat(lastDate) {
        if ((moment(lastDate).year() !== 1970)) {
            return (
                <div>
                    <i>
                        <font color="gray">
                            (Last: {moment(lastDate).fromNow()})
                    </font>
                    </i>
                </div>
            )
        } else {
            return (
                <div>
                    <i>
                        <font color="gray">
                            (Last: None)
                    </font>
                    </i>
                </div>
            )
        }
    }

    showOrders() {
        let { orders, responseRecieved } = this.state;
        if (responseRecieved) {
            return orders.map((order, index) => {
                return (
                    <TableRow key={`order_` + index}>
                        <TableRowColumn style={{ width: 3 }}>{order.productId}</TableRowColumn>
                        <TableRowColumn>{order.productName}</TableRowColumn>
                        <TableRowColumn>{order.requiredQuantity}</TableRowColumn>
                        <TableRowColumn>{order.createdTillNow} {this.lastFormat(order.lastCreated)}</TableRowColumn>
                        <TableRowColumn>{order.predicted} {this.lastFormat(order.timeCreated)}</TableRowColumn>
                        <TableRowColumn>
                            <RaisedButton label="Done"
                                onClick={
                                    () => {
                                        this.setState({
                                            responseRecieved: false
                                        })
                                        this.setDone(order);

                                    }
                                }
                                primary={true}
                                disabled={!this.state.responseRecieved} />
                        </TableRowColumn>
                    </TableRow>
                )
            })
        } else {
            return (
                <TableRow key={`order_`}>
                    <TableRowColumn>
                        <div style={{ textAlign: "center" }}>
                            <RefreshIndicator
                                size={40}
                                left={10}
                                top={0}
                                status="loading"
                                style={{ display: 'inline-block', position: 'relative' }}
                            />
                        </div>
                    </TableRowColumn>
                </TableRow>
            )
        }
    }

    render() {
        return (
            <div className="homeContainer">
                {this.state.error}
                <div className="allorders">
                    <Table>
                        <TableHeader
                            adjustForCheckbox={false}
                            displaySelectAll={false}
                        >
                            <TableRow>
                                <TableHeaderColumn style={{ width: 3 }}>ID</TableHeaderColumn>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Required Quantity</TableHeaderColumn>
                                <TableHeaderColumn>Created Till Now</TableHeaderColumn>
                                <TableHeaderColumn>Predicted</TableHeaderColumn>
                                <TableHeaderColumn>Done</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                        >
                            {this.showOrders()}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }
}