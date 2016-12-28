import React, { Component } from 'react'
import settings from '../settings.default.js';

export default class HomePage extends Component {
    
    componentDidUpdate( ) {
        var itemComponent = this.refs.columns;
        if ( itemComponent ) {
            itemComponent.scrollLeft = itemComponent.scrollWidth;
        }
    }

    render( ) {
        return (
            <div className="full">
                <h1>Settings</h1>
            </div>
        );
    }

}
