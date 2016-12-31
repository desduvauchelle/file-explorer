import React, { Component, PropTypes } from 'react'
import fs from 'fs'
import Path from 'path'
import { shell } from 'electron'
import { getInfo } from '../../../../utils/fileSystemTools.js'

class FileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        selectPath: PropTypes.func.isRequired,
        isSelected: PropTypes.bool,
        isFavorite: PropTypes.bool,
        handleClick: PropTypes.func,
        handleDoubleClick: PropTypes.func,
        handleDoubleClickFolder: PropTypes.func
    };

    static defaultProps = {
        file: "",
        isSelected: false,
        isFavorite: false,
        handleClick: (file = "", selectPath) => {
            selectPath(file)
        },
        handleDoubleClick: (file = "") => {
            shell.openItem(file)
        },
        handleDoubleClickFolder(file = "", isMacApp = false) {
            if (isMacApp) {
                shell.openItem(file);
                return;
            }
            shell.showItemInFolder(file);
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        let {file, isSelected, isFavorite, selectPath, handleClick, handleDoubleClick, handleDoubleClickFolder} = this.props;

        let isDirectory = false;
        let directoryInfo = getInfo(file);
        if (directoryInfo && directoryInfo.isDirectory) {
            isDirectory = true;
        }

        let fileParse = Path.parse(file);
        let displayName = fileParse.name + fileParse.ext;
        let isMacApp = false;
        if (isDirectory && displayName.endsWith('.app')) {
            displayName = displayName.replace('.app', '');
            isMacApp = true;
        }

        return (
            <a onClick={handleClick.bind(this, file, selectPath)}
               onDoubleClick={!isDirectory ? handleDoubleClick.bind(this, file) : handleDoubleClickFolder.bind(this, file, isMacApp)}
               className={isSelected ? 'selected' : ''}><i className={isDirectory ? `icon-file-directory ${isSelected ? 'open' : ''} left` : 'icon-file left'}
                                                                                                                 data-name={displayName} />
                {displayName}
                {(!isFavorite && (isDirectory && !isMacApp)) && (<i className="fa fa-caret-right right" />)}
            </a>
            );
    }
}

export default FileItem;
