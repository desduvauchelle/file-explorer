import React, { Component } from 'react'
import fs from 'fs'
import Path from 'path'
// const swarl = ( ) => {}

import settings from '../settings.default.js';

export default class HomePage extends Component {
    constructor( props ) {
        super( props );
    }

    state = {}

    componentDidUpdate( ) {
        var itemComponent = this.refs.columns;
        if ( itemComponent ) {
            itemComponent.scrollLeft = itemComponent.scrollWidth;
        }
    }

    render( ) {
        const self = this;

        return (
            <div className="full">
                <h1>Settings</h1>
            </div>
        );
    }

}
