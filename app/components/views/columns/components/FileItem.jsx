import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Path from 'path'
import { shell } from 'electron'
import { spawn } from 'child_process'
import { getInfo } from '../../../../utils/fileSystemTools.js'

class FileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        selectPath: PropTypes.func.isRequired,
        isSelected: PropTypes.bool,
        isFavorite: PropTypes.bool,
        handleClick: PropTypes.func,
        handleDoubleClick: PropTypes.func,
        handleDoubleClickFolder: PropTypes.func,
        handleRemoveFavorite: PropTypes.func,
        isDragging: PropTypes.bool

    };

    static defaultProps = {
        file: "",
        isSelected: false,
        isFavorite: false,
        isDragging: false,
        handleClick: (self) => {
            if (self.props.isFavorite) {
                self.props.selectPath(self.props.file);
                return;
            }
            self.props.selectPath(self.fileParse.dir, self.fileParse.base);
        },
        handleDoubleClick: (file = "", self) => {
            if(self, self.isDirectory){
               if (self.isMacApp) {
                    shell.openItem(file);
                    return;
                }
                // spawn('C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',[file])
                shell.showItemInFolder(file);  
                return;
            }
            shell.openItem(file)
        },
        handleRemoveFavorite: () => {
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
        const {file, isSelected, isFavorite, isDragging, handleClick, handleDoubleClick, handleDoubleClickFolder, handleRemoveFavorite} = this.props;

        return (
            <a onClick={handleClick.bind(this, this)}
               onDoubleClick={handleDoubleClick.bind(this, file, this)}
               className={`${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}><i className={this.isDirectory ? `icon-file-directory ${isSelected ? 'open' : ''} left` : 'icon-file left'}
                                                                                                                 data-name={this.displayName} />
                {this.displayName}
                {(!isFavorite && (this.isDirectory && !this.isMacApp)) && (<i className="fa fa-caret-right right" />)}
                {isFavorite && (<i onClick={(e) => {
                                 e.stopPropagation();
                                 handleRemoveFavorite();
                             }}
                                   className="fa fa-trash-o right favorite-remove" />)}
            </a>
            );
    }
}

export default FileItem;
