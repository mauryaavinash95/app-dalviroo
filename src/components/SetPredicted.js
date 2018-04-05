import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

import { getCredentials } from '../functions/credentials';
import { setPredictions } from '../functions/setPredictions';

export default class SetPredicted extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials: { username: null, token: null, groupId: 0 },
            productName: "",
            productId: "",
            predictedQuantity: "",
            response: true,
            snackbarmessage: "",
            snackbaropen: false,
        }
    }

    componentWillMount() {
        getCredentials()
            .then((credentials) => {
                this.setState({ credentials });
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }

    changeProductId(e) {
        this.setState({
            productId: e.target.value
        })

    }

    changeProductName(e) {
        this.setState({
            productName: e.target.value
        })
    }

    changePredictedQuantity(e) {
        this.setState({
            predictedQuantity: e.target.value
        })
    }

    handleSubmit(e) {
        let { productId, productName, predictedQuantity } = this.state;
        e.preventDefault();
        this.setState({
            response: false,
            snackbaropen: false
        })
        setPredictions(productId, productName, predictedQuantity)
            .then((res) => {
                console.log("result is: ", res);
                this.setState({
                    response: true,
                    snackbaropen: true,
                    productId: "",
                    productName: "",
                    predictedQuantity: "",
                    snackbarmessage: `Prediction for ${productName}, #${predictedQuantity} placed successfully`
                })
            })
            .catch((err) => {
                console.log("Error while predicting ", err);
                this.setState({
                    response: true,
                    snackbaropen: true,
                    snackbarmessage: `Error while setting predicted value`
                })
            })
    }

    render() {
        let { username, groupId } = this.state.credentials;
        return (
            <div style={{ width: "100%" }}>
                <Card>
                    <CardHeader
                        title="Set Prediction"
                        subtitle={`Welcome '${username}', please place predictions on behalf of Group '${groupId}'.`}
                    />
                    <CardText >
                        <TextField
                            hintText="Product Name"
                            fullWidth={true}
                            onChange={this.changeProductName.bind(this)}
                            value={this.state.productName}
                        />
                        <TextField
                            hintText="Product ID"
                            fullWidth={true}
                            onChange={this.changeProductId.bind(this)}
                            value={this.state.productId}
                        />
                        <TextField
                            hintText="Predicted Quantity"
                            fullWidth={true}
                            onChange={this.changePredictedQuantity.bind(this)}
                            value={this.state.predictedQuantity}
                        />
                        <RaisedButton label="Submit" primary={true} fullWidth={true} onClick={this.handleSubmit.bind(this)} disabled={!this.state.response} />


                        <Snackbar
                            open={this.state.snackbaropen}
                            message={this.state.snackbarmessage}
                            autoHideDuration={5000}
                            onRequestClose={
                                () => {
                                    this.setState({
                                        snackbaropen: false,
                                    });
                                }
                            }
                        />

                    </CardText>
                </Card>
            </div>
        )
    }
}