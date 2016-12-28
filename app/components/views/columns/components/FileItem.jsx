import React, { Component, PropTypes } from 'react';
import fs from 'fs';
import Path from 'path';
import { shell } from 'electron';
import settings from '../../../../settings.default';

class FileItem extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired,
        currentPath: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        selectPath: PropTypes.func.isRequired
    };

    render( ) {
        let { path, file, currentPath, selected, selectPath } = this.props;
        let filePath = Path.join( path, file );

        try {
            const isDirectory = fs.statSync( filePath ).isDirectory( );
            if ( isDirectory ) {
                const isSelected = currentPath && currentPath.indexOf( filePath ) !== -1;
                return (
                    <a onClick={e => {
                        e.preventDefault( );
                        selectPath( filePath );
                    }} onDoubleClick={e => {
                        e.preventDefault( );
                        shell.showItemInFolder( filePath );
                    }} className={isSelected
                        ? 'selected'
                        : ''}>
                        <i className={`icon-file-directory ${ isSelected
                            ? 'open'
                            : '' } left`} data-name={file}/>{file}<i className="fa fa-caret-right right"/></a>
                );
            }
        } catch ( ex ) {
            console.log( `Failed to analyze: ${ filePath }, Caused by: ${ ex }` );
        }
        // For mac, if it has the .app extension, it's an application and should be treated differently
        if (file.endsWith( '.app' )) {
            file = file.replace( '.app', '' );
        }
        return (
            <a onClick={( e ) => {
                e.preventDefault( );
                selectPath( path, file );
            }} onDoubleClick={( e ) => {
                e.preventDefault( );
                shell.openItem( filePath );
            }} className={selected
                ? 'selected'
                : ''}><i className="icon-file left" data-name={file}/>{file}</a>
        );
    }
}

export default FileItem;
