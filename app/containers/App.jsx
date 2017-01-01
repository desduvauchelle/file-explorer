import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

class App extends Component {
    static propTypes = {
        children: PropTypes.element,
        view: PropTypes.object
    }

    render() {
        const {theme} = this.props.view;
        return (
            <div className={`full ${theme || ''}`}>
                <Helmet titleTemplate="FileExplorer - %s"
                        defaultTitle="FileExplorer" />
                {this.props.children}
            </div>
            );
    }
}

export default connect(
    state => ({
        view: state.view
    }), {
    }
)(App);