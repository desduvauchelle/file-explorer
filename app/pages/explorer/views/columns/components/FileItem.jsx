import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Path from 'path'
import { shell } from 'electron'
import { spawn } from 'child_process'
import { getInfo } from 'alias-utils/fileSystemTools'
import ReduxBinder from 'alias-redux/ReduxBinder'

class FileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        isSelected: PropTypes.bool,
        isFavorite: PropTypes.bool,
        handleClick: PropTypes.func,
        handleDoubleClick: PropTypes.func,
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
                self.props.actions.fileExplorer.goTo(self.props.file);
                return;
            }
            self.props.actions.fileExplorer.goTo(self.fileParse.dir, self.fileParse.base);
        },
        handleDoubleClick: (file = "", self) => {
            if (self && self.isDirectory) {
                if (self.isMacApp) {
                    shell.openItem(file);
                    return;
                }
                // spawn('C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',[file])
                if (self.props.state.settings.pathsOpenWith) {
                    let specialPathOpening = self.props.state.settings.pathsOpenWith.filter(p => file === p.path)
                    if (specialPathOpening.length > 0) {
                        if (specialPathOpening[0].appId) {
                            let foundApps = self.props.state.settings.apps.filter(a => a.id === specialPathOpening[0].appId)
                            if (foundApps.length > 0) {
                                try {
                                    spawn(foundApps[0].path, [file])
                                } catch (ex) {
                                    console.log(`Failed to launch: ${file} with ${foundApps[0].name}, Caused by: ${ex}`); // eslint-disable-line
                                }
                                return
                            }
                        }
                    }
                }
                shell.showItemInFolder(file);
                return;
            }
            if (self.props.state.settings.extensionsOpenWith) {
                let specialExtensionOpening = self.props.state.settings.extensionsOpenWith.filter(e => file.indexOf(e.extension) !== -1)
                if (specialExtensionOpening.length > 0) {
                    if (specialExtensionOpening[0].appId) {
                        let foundApps = self.props.state.settings.apps.filter(a => a.id === specialExtensionOpening[0].appId)
                        if (foundApps.length > 0) {
                            try {
                                spawn(foundApps[0].path, [file])
                            } catch (ex) {
                                console.log(`Failed to launch: ${file} with ${foundApps[0].name}, Caused by: ${ex}`); // eslint-disable-line
                            }
                            return
                        }
                    }
                }
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
        const {file, isSelected, isFavorite, isDragging, handleClick, handleDoubleClick, handleRemoveFavorite} = this.props;

        return (
            <a onClick={(e) => {
                e.preventDefault();
                handleClick(this);
            }}
               href={isFavorite ? null : file}
               onDoubleClick={(e) => {
                                  e.preventDefault();
                                  handleDoubleClick(file, this)
                              }}
               className={`${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}><i className={this.isDirectory ? `icon-file-directory ${isSelected ? 'open' : ''} left` : 'icon-file left'}
                                                                                                                                           data-name={this.displayName} />
                {this.displayName}
                {(!isFavorite && (this.isDirectory && !this.isMacApp)) && (<i className="fa fa-caret-right right" />)}
                {isFavorite && (<i onClick={(e) => {
                                 e.stopPropagation();
                                 e.preventDefault();
                                 handleRemoveFavorite();
                             }}
                                   className="fa fa-trash-o right favorite-remove" />)}
            </a>
            );
    }
}

export default ReduxBinder(FileItem, {
    state: ['settings']
})
