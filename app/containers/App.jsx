import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class App extends Component {
    static propTypes = {
        children: PropTypes.element,
        view: PropTypes.object
    }

    render() {
        console.log(this.props.view);
        const {theme} = this.props.view;
        return (
            <div className={`full ${theme || ''}`}>
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