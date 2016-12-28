import React, { Component } from 'react';
import Path from 'path';
import fs from 'fs';
import { shell } from 'electron';

export default class Column extends Component {
    static propTypes = {
        directory: React.PropTypes.object,
        selectPath: React.PropTypes.func,
        settings: React.PropTypes.object,
        isLast: React.PropTypes.bool
    }
    state = {}

    constructor( props ) {
        super( props );
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
                    const isDirectory = fs.statSync( filePath ).isDirectory( );

                    if ( isDirectory ) {
                        return (
                            <a key={i} onClick={( e ) => {
                                e.preventDefault( );
                                selectPath( filePath );
                            }} onDoubleClick={( e ) => {
                                e.preventDefault( );
                                shell.showItemInFolder( filePath );
                            }} className={currentPath && currentPath.indexOf( filePath ) !== -1
                                ? 'selected'
                                : ''}><i className={`icon-file-directory left`} data-name={file}/>{file}</a>
                        );
                    }

                    return (
                        <a key={i} onClick={( e ) => {
                            e.preventDefault( );
                            selectPath( path, file );
                        }} onDoubleClick={( e ) => {
                            e.preventDefault( );
                            shell.openItem( filePath );
                        }} className={selectedFile === file
                            ? 'selected'
                            : ''}><i className="icon-file left" data-name={file}/>{file}</a>
                    );
                })}
            </section>
        );
    }

}
