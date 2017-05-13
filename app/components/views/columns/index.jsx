import React, { Component, PropTypes } from 'react'
import fs from 'fs'
import Helmet from 'react-helmet'
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
import { keyMap, handlers } from '../../../utils/keymapping'

@DragDropContext(HTML5Backend)
export default class Columns extends Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
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
        const { actions, state } = this.props;
        const { linkAdd, sectionAdd } = actions.favorite;
        let { path, selected } = this.props.location.query;
        // Get the root of hard drive (in mac, it's / whereas in windows it's C:\\)
        this.rootPath = Path.parse(__dirname).root;
        path = path || this.rootPath;
        // Get list of the directories and it's children
        let list = [];
        if (!path || path === this.rootPath) {
            let dirListing = this._getDirectoryListing(this.rootPath);
            list.push({
                path: this.rootPath,
                files: dirListing.files,
                error: dirListing.error,
                isCurrent: true
            });
        } else {
            let directories = path.split(Path.sep);
            if (path.indexOf("C:\\") !== -1) {
                // Do something special for windows
                directories[0] = "C:\\";
                delete directories[1];
            }
            let currentPath = "";
            directories.map(directory => {
                if (directory === "") {
                    currentPath = this.rootPath
                } else {
                    currentPath = Path.join(currentPath, directory)
                }
                currentPath = Path.normalize(currentPath);
                let dirListing = this._getDirectoryListing(currentPath);
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
                    let dirListing = this._getDirectoryListing(filePath);
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
                /* eslint-disable */
                console.log(`Failed to analyze: ${filePath}, Caused by: ${ex}`);
                /* esling-enable */
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
                        <Favorites selectPath={this._selectPath}
                            {...this.props} />
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
                        {selected ? Path.join(path, selected) : path}
                    </div>
                    {/* MODALS */}
                    <PreviewModal previewModalIsOpen={this.state.previewModalIsOpen}
                        onHide={() => {
                            this.setState({
                                previewModalIsOpen: false
                            })
                        }}
                        path={path}
                        selected={selected} />
                    <FileItemRenameModal isOpen={this.state.renameModalIsOpen}
                        onHide={() => {
                            this.setState({
                                renameModalIsOpen: false
                            })
                        }}
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

    _getDirectoryListing(path) {
        try {
            let files = fs.readdirSync(path) || [];
            if (!this.props.state.view.showHidden) {
                files = files.filter(file => file.charAt(0) !== '.');
            }
            return {
                files: files.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            };
        } catch (ex) {
            console.log(`Failed to list directory files. path=${path}, caused by: ${ex}`);
            return {
                files: [],
                error: "Permission denied"
            };
        }
    }

    _selectPath = (path = '/', selected = null) => {
        // If no selected, select the first if it's a directory
        if (!selected) {
            const currentDirectory = this._getDirectoryListing(path);
            if (currentDirectory.files.length > 0) {
                selected = currentDirectory.files[0];
            }
        }

        this.props.router.replace({
            pathname: '/',
            query: {
                path: Path.normalize(path),
                selected: selected
            }
        })
    }

    _goToSettings = () => {
        this.props.router.replace({
            pathname: '/settings'
        })
    }
}

