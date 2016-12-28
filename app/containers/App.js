import React, { Component } from 'react';

export default class App extends Component {
    static propTypes = {
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
