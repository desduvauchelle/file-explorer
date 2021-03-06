import React, { Component } from 'react'
import Columns from './views/columns'

export default class View extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // This layer is to enable different views. For example: columns, grid, search results, ...
        return <div className="app-wrapper">
                   <div className="view-wrapper">
                       <Columns {...this.props}/>
                   </div>
               </div>
    }
}
