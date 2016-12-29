import React, { Component, PropTypes } from 'react';
import fs from 'fs';
import Path from 'path';
import { shell } from 'electron';

class FileItem extends Component {
    static propTypes = {
        directory: PropTypes.object,
        path: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired,
        currentPath: PropTypes.string.isRequired,
        selected: PropTypes.string,
        selectPath: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.filePath = Path.join(props.path, props.file); 
        // For mac, if it has the .app extension, it's an application and should be treated differently
        this.displayName = props.file;
        this.isMacApp = false;
        if (this.displayName.endsWith( '.app' )) {
            this.displayName = this.displayName.replace( '.app', '' );
            this.isMacApp = true;
        }
    }

    handleClick(e){
        e.preventDefault();
        this.props.selectPath(this.props.path, this.props.file);
    }

    handleDoubleClickFile(e){
        e.preventDefault();
        shell.openItem(this.filePath);
    }

    handleDoubleClickFolder(e){
        e.preventDefault( );
        if(this.isMacApp){
            shell.openItem( this.filePath );
            return;
        }
        shell.showItemInFolder( this.filePath );
    }

    render( ) {
        let { file, currentPath, selected, directory } = this.props;
        let isSelected = false;
        if(directory.isCurrent){
            isSelected = (selected && selected === file);
        } else {
            isSelected = currentPath && currentPath.indexOf( this.filePath ) !== -1;
        }
        try {
            const isDirectory = fs.statSync( this.filePath ).isDirectory( );
            if ( isDirectory ) {                
                return (
                    <a onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClickFolder.bind(this)} className={isSelected? 'selected': ''}>
                        <i className={`icon-file-directory ${ isSelected? 'open': '' } left`} data-name={file}/>
                        {this.displayName}{!this.isMacApp && (<i className="fa fa-caret-right right"/>)}
                    </a>
                );
            }
        } catch ( ex ) {
            console.log( `Failed to analyze: ${ this.filePath }, Caused by: ${ ex }` );
        }
        return (
            <a onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClickFile.bind(this)} className={isSelected? 'selected': ''}>
                <i className="icon-file left" data-name={file}/>{file}
            </a>
        );
    }
}

export default FileItem;
