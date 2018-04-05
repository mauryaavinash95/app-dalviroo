import React from 'react';
import Header from './Header';
import '../styles/main.css';
import history from '../routes/history';
import { getCredentials } from '../functions/credentials';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Home from 'material-ui/svg-icons/editor/format-list-numbered';
import CreateOrder from 'material-ui/svg-icons/editor/border-color';
import Prediction from 'material-ui/svg-icons/editor/bubble-chart';
const createOrderIcon = <CreateOrder />
const predictionIcon = <Prediction />;
const homeIcon = <Home />;

const unAuthPaths = ["/"];
const paths = ["/home", "/createorders", "/setpredicted"];

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            authenticated: false
        }
        this.getCredentials = getCredentials;
    }

    componentWillMount() {
        this.getCredentials()
            .then((result) => {
                console.log("User already logged in: ", result.username);
                this.setState({
                    authenticated: true
                })
                if (unAuthPaths.includes(history.location.pathname)) {
                    history.push("/home");
                    // history.go();
                }
            })
            .catch((err) => {
                // console.log("Please login first");
                if (paths.includes(history.location.pathname)) {
                    history.push("/");
                    // history.go();
                }
            })
        this.setState({
            selectedIndex: paths.indexOf(history.location.pathname)
        });
    }

    select(index) {
        // console.log("Pushing at: ", index, this.state.selectedIndex);
        history.push(index);
        this.setState({
            selectedIndex: paths.indexOf(history.location.pathname)
        });
    }

    renderChildren() {
        return this.props.children;
        // const newChild = React.cloneElement(this.props.children, { userId: "somethingFromMain", token: "somethingTokenishFromMain" });
        // return newChild;
        // return React.Children.map(this.props.children, (child) => {
        //     return React.cloneElement(child, { userId: "somethingFromMain" });
        // });
    }

    showFooter() {
        if (this.state.authenticated) {
            return (
                <div className="navbar">
                    <Paper zDepth={1}>
                        <BottomNavigation selectedIndex={this.state.selectedIndex}>
                            <BottomNavigationItem
                                label="View Orders"
                                icon={homeIcon}
                                onClick={() => this.select(paths[0])}
                            />
                            <BottomNavigationItem
                                label="Create Orders"
                                icon={createOrderIcon}
                                onClick={() => this.select(paths[1])}
                            />
                            <BottomNavigationItem
                                label="Set Predicted"
                                icon={predictionIcon}
                                onClick={() => this.select(paths[2])}
                            />
                        </BottomNavigation>
                    </Paper>
                </div>
            )
        } else {
            return undefined;
        }
    }

    render() {
        return (
            <MuiThemeProvider >
                <div className="container">
                    <Header title="Dalviroo" authenticated={this.state.authenticated} />
                    <div className="contentContainer">
                        <div className="children">
                            {this.renderChildren()}
                        </div>
                        {this.showFooter()}
                    </div>
                </div>
            </MuiThemeProvider>

        )
    }
}