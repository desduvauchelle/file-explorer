import React, { Component, PropTypes } from 'react';
import FileItem from './FileItem.jsx';

export default class Column extends Component {
    static propTypes = {
        directory: PropTypes.object,
        selectPath: PropTypes.func,
        settings: PropTypes.object,
        isLast: PropTypes.bool,
        currentPath: PropTypes.string.isRequired,
        selectedFile: PropTypes.string
    }

    constructor( props ) {
        super( props );

        this.state = {}
    }

    render( ) {
        const {
            directory,
            selectPath,
            currentPath,
            isLast,
            selectedFile
        } = this.props;

        return (
            <section>
                {directory.error && (
                    <p className="error">{directory.error}</p>
                )}
                {directory.files.length === 0 && !directory.error && (
                    <p>No files</p>
                )}
                {directory.files.map( (file, i) => 
                    <FileItem key={i} path={directory.path} file={file} currentPath={currentPath} selectPath={selectPath} selected={selectedFile === file}/>
                )}
            </section>
        );
    }

}
