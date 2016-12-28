import React, { Component, PropTypes } from 'react';
import Path from 'path';
import fs from 'fs';
import { shell } from 'electron';

export default class Column extends Component {
    static propTypes = {
        directory: PropTypes.object,
        selectPath: PropTypes.func,
        settings: PropTypes.object,
        isLast: PropTypes.bool
    }

    constructor( props ) {
        super( props );

        this.state = {}
    }

    render( ) {
        const {
            directory,
            selectPath,
            settings,
            currentPath,
            isLast,
            selectedFile
        } = this.props;
        let { path, files } = directory;

        return (
            <section>
                {files.length === 0 && (
                    <p>No files</p>
                )}
                {files.map(( file, i ) => {
                    let filePath = Path.join( path, file );
                    try{
                        const isDirectory = fs.statSync( filePath ).isDirectory( );

                        if ( isDirectory ) {
                            return (
                                <a key={i} onClick={ e => {
                                    e.preventDefault();
                                    selectPath( filePath );
                                }} onDoubleClick={ e => {
                                    e.preventDefault();
                                    shell.showItemInFolder( filePath );
                                }} className={currentPath && currentPath.indexOf( filePath ) !== -1
                                    ? 'selected'
                                    : ''}><i className={`${ settings.icons['folder'] } left`}/>{file}</a>
                            );
                        }
                    }catch(ex){
                        console.log(`Failed to analyze: ${filePath}, Caused by: ${ex}`);
                    }

                    let extensionName = Path.extname( file );
                    if ( extensionName.charAt( 0 ) === '.' ) {
                        extensionName = extensionName.substr( 1 )
                    }
                    if (!settings.icons[extensionName]) {
                        extensionName = 'file';
                    }
                    const icon = `${settings.icons[extensionName]} left`;

                    return (
                        <a key={i} onClick={( e ) => {
                            e.preventDefault( );
                            selectPath( path, file );
                        }} onDoubleClick={( e ) => {
                            e.preventDefault( );
                            shell.openItem( filePath );
                        }} className={selectedFile === file
                            ? 'selected'
                            : ''}><i className={icon}/>{file}</a>
                    );
                })}
            </section>
        );
    }

}
