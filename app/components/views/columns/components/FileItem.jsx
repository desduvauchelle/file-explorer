import React, { Component, PropTypes } from 'react'
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
        handleClick: (self, file = "") => {
            if (self.isDirectory) {
                self.props.selectPath(file);
                return;
            }
            self.props.selectPath(self.fileParse.dir, self.fileParse.base);
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
        const {file} = this.props;
        this.directoryInfo = getInfo(file);
        this.isDirectory = this.directoryInfo.isDirectory;
        //
        this.fileParse = Path.parse(file);
        this.displayName = this.fileParse.base;
        //
        this.isMacApp = false;
        if (this.isDirectory && this.fileParse.ext === ".app") {
            this.displayName = this.displayName.replace('.app', '');
            this.isMacApp = true;
        }
    }

    render() {
        const {file, isSelected, isFavorite, handleClick, handleDoubleClick, handleDoubleClickFolder} = this.props;

        return (
            <a onClick={handleClick.bind(this, this, file)}
               onDoubleClick={!this.isDirectory ? handleDoubleClick.bind(this, file) : handleDoubleClickFolder.bind(this, file, this.isMacApp)}
               className={isSelected ? 'selected' : ''}><i className={this.isDirectory ? `icon-file-directory ${isSelected ? 'open' : ''} left` : 'icon-file left'}
                                                                                                                 data-name={this.displayName} />
                {this.displayName}
                {(!isFavorite && (this.isDirectory && !this.isMacApp)) && (<i className="fa fa-caret-right right" />)}
            </a>
            );
    }
}

export default FileItem;
