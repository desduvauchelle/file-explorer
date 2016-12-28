import React, {Component, PropTypes} from 'react';
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

    render() {
        let { path, file, currentPath, selected, selectPath} = this.props;
        let filePath = Path.join( path, file );
        let extensionName = Path.extname( file );
        if ( extensionName.charAt( 0 ) === '.' ) {
            extensionName = extensionName.substr( 1 )
        }
        if (!settings.icons[extensionName]) {
            extensionName = 'file';
        }
        const icon = `${settings.icons[extensionName]} left`;
        
        try{
            const isDirectory = fs.statSync( filePath ).isDirectory( );
            if ( isDirectory ) {
                return (
                    <a onClick={ e => {
                        e.preventDefault();
                        selectPath( filePath );
                    }} onDoubleClick={ e => {
                        e.preventDefault();
                        shell.showItemInFolder( filePath );
                    }} className={currentPath && currentPath.endsWith( filePath ) ? 'selected' : ''}>
                    <i className={`icon-file-directory left`} data-name={file}/>{file}</a>
                );
            }
        }catch(ex){
            console.log(`Failed to analyze: ${filePath}, Caused by: ${ex}`);
        }
        return (       
            <a onClick={( e ) => {
                e.preventDefault( );
                selectPath( path, file );
            }} onDoubleClick={( e ) => {
                e.preventDefault( );
                shell.openItem( filePath );
            }} className={selected? 'selected':''}><i className={icon} data-name={file}/>{file}</a>
        );
    }
}

export default FileItem;