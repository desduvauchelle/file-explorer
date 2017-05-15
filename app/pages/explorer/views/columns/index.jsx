import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fs from 'fs'
import Helmet from 'react-helmet'
import ReduxBinder from 'alias-redux/ReduxBinder'
// Plugins
import { HotKeys } from 'react-hotkeys'
import Path from 'path'

// Drag and drop
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
// Components
import Header from './components/Header'
import Favorites from './components/Favorites'
import Column from './components/Column'
import Preview from './components/Preview'
import PreviewModal from './components/PreviewModal'
import FileItemRenameModal from './components/FileItemRenameModal'
// Settings
import { keyMap, handlers } from 'alias-utils/keymapping'
import fileSystemTools from 'alias-utils/fileSystemTools'

@DragDropContext(HTML5Backend)
class Columns extends Component {

    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            previewModalIsOpen: false,
            renameModalIsOpen: false
        }
    }

    componentDidUpdate() {
        let itemComponent = this.refs.columns;
        if (itemComponent) {
            itemComponent.scrollLeft = itemComponent.scrollWidth;
        }
    }
    componentDidMount() {
        let itemComponent = this.refs.columns;
        if (itemComponent) {
            itemComponent.scrollLeft = itemComponent.scrollWidth;
        }
    }

    render() {
        const {actions, state} = this.props;

        const {linkAdd, sectionAdd} = actions.favorites;
        let {path, selected} = state.fileExplorer;
        const showHidden = state.settings.showHidden;
        // Get the root of hard drive (in mac, it's / whereas in windows it's C:\\)
        let rootPath = Path.sep;
        let footerPath = ''
        path = path || rootPath;
        // Get list of the directories and it's children
        let list = [];
        let directories = [];
        if (!path || path === rootPath) {
            let dirListing = fileSystemTools.getDirectoryListing(rootPath, showHidden);
            list.push({
                path: rootPath,
                files: dirListing.files,
                error: dirListing.error,
                isCurrent: true
            });
        } else {
            directories = path.split(Path.sep);
            let currentPath = "";
            directories.map(directory => {
                if (directory === "") {
                    currentPath = rootPath
                } else {
                    currentPath = Path.join(currentPath, directory)
                }
                currentPath = Path.normalize(currentPath);
                let dirListing = fileSystemTools.getDirectoryListing(currentPath, showHidden);
                let isCurrent = (selected && path === currentPath) || (!selected && Path.join(path, '..') === currentPath);

                list.push({
                    path: currentPath,
                    files: dirListing.files,
                    error: dirListing.error,
                    isCurrent: isCurrent
                });
            })
        }
        let showFileInfo = false;
        if (selected) {
            const filePath = Path.join(path, selected);
            try {
                const isDirectory = fs.statSync(filePath).isDirectory();
                if (isDirectory && selected.indexOf('.app') === -1) {
                    let dirListing = fileSystemTools.getDirectoryListing(filePath, showHidden);
                    list.push({
                        path: filePath,
                        files: dirListing.files,
                        error: dirListing.error,
                        isCurrent: false
                    });
                } else {
                    showFileInfo = true;
                }
            } catch (ex) {
                console.log(`Failed to analyze: ${filePath}, Caused by: ${ex}`); // eslint-disable-line
            }
        }

        // For key mapping
        const hokeyHandlers = handlers(this, list, path, selected);
        return (
            <HotKeys keyMap={keyMap}
                     handlers={hokeyHandlers}>
                <Helmet title={selected} />
                <div className="explorer">
                    <div className="explorer-header">
                        <Header path={path}
                                selected={selected}
                                hokeyHandlers={hokeyHandlers}
                                linkAdd={linkAdd}
                                sectionAdd={sectionAdd}
                                actions={actions}
                                goToSettings={this._goToSettings} />
                    </div>
                    <div className="column favorites">
                        <Favorites />
                    </div>
                    <div className="columns-wrapper"
                         ref="columns">
                        {list.map((directory, i) => {
                             return (
                                 <div className={directory.isCurrent ? 'column active' : 'column'}
                                      key={directory.path + i}>
                                     <Column directory={directory}
                                             path={path}
                                             selectPath={this._selectPath}
                                             forceRefresh={this.forceRefresh.bind(this)}
                                             selected={selected} />
                                 </div>
                             )
                         })}
                        {showFileInfo && (
                         <div className="column column-preview">
                             <Preview path={path}
                                      isColumnView={true}
                                      selected={selected}
                                      previewModalIsOpen={this.state.previewModalIsOpen} />
                             <h3>{selected}</h3>
                         </div>
                         )}
                    </div>
                    <div className="explorer-footer">
                        {directories.map((dir, i) => {
                             if (i === 0) {
                                 footerPath = "/"
                             }
                             if (dir === '.') {
                                 return null
                             }
                             let display = <span key={i}><a onClick={this._selectPath.bind(this, footerPath, dir)}>{dir}</a>{(i < directories.length) ? ' / ' : ''}</span>
                             footerPath = Path.join(footerPath, dir)
                             return display
                         })}
                        {selected ? `${selected}` : ''}
                    </div>
                    {/* MODALS */}
                    <PreviewModal previewModalIsOpen={this.state.previewModalIsOpen}
                                  onHide={() => this.setState({
                                              previewModalIsOpen: false
                                          })}
                                  path={path}
                                  selected={selected} />
                    <FileItemRenameModal isOpen={this.state.renameModalIsOpen}
                                         onHide={() => this.setState({
                                                     renameModalIsOpen: false
                                                 })}
                                         forceRefresh={this.forceRefresh.bind(this)}
                                         path={path}
                                         selected={selected} />
                </div>
            </HotKeys>
            );
    }

    forceRefresh() {
        this.forceUpdate();
    }

    _selectPath = (path = '/', selected = null) => {
        // If no selected, select the first if it's a directory
        if (!selected) {
            const currentDirectory = fileSystemTools.getDirectoryListing(path, this.props.state.settings.showHidden);
            if (currentDirectory.files.length > 0) {
                selected = currentDirectory.files[0];
            }
        }
        this.props.actions.fileExplorer.goTo(Path.normalize(path), selected)
    }

    _goToSettings = () => {
        this.props.actions.navigation.goToPage('settings')
    }
}

export default ReduxBinder(Columns, {
    state: ['fileExplorer', 'settings']
})