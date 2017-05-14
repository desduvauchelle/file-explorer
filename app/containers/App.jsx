import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

class App extends Component {
    static propTypes = {
        children: PropTypes.element,
        view: PropTypes.object
    }

    componentDidMount() {
        let body = document.body;
        body.className = this.props.view.theme;
    }
    componentWillReceiveProps(nextProps) {
        let body = document.body;
        body.className = nextProps.view.theme;
    }

    render() {
        return (
            <div className="full">
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