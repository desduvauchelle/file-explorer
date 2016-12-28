import React, { Component } from 'react';
const { remote } = require( 'electron' )

export default class App extends Component {
    props : {
        children: HTMLElement
    };

    render( ) {
        return (
            <div className="full">
                {this.props.children}
            </div>
        );
    }
}
