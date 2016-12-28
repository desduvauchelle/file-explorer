import React, { Component, PropTypes } from 'react'
import fs from 'fs'
// Plugins
import { HotKeys } from 'react-hotkeys'
import Path from 'path'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
// Components
import Favorites from './components/Favorites'
import Column from './components/Column'
import Preview from './components/Preview'
// Settings
import settings from '../../../settings.default';
import { keyMap, handlers } from '../../../utils/keymapping'

export default class Columns extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    }

    constructor( props ) {
        super( props );
        
        this.state = {
            previewModalIsOpen: false
        }
    }

    componentDidUpdate( ) {
        var itemComponent = this.refs.columns;
        if ( itemComponent ) {
            itemComponent.scrollLeft = itemComponent.scrollWidth;
        }
    }

    render( ) {
        let { sectionAdd, sectionRemove, sectionEdit, linkAdd, linkRemove } = this.props;
        let { path, selected } = this.props.location.query;
        // Get the root of hard drive (in mac, it's / whereas in windows it's C:\\)
        let rootPath = Path.parse( __dirname ).root;
        path = path || rootPath;
        console.log( path, selected );

        let list = [ ];
        if ( !path ) {
            let dirListing = this._getDirectoryListing( rootPath );
            list.push({path: rootPath, files: dirListing.files, error: dirListing.error});
        } else {
            let directories = path.split( Path.sep );
            let currentPath = "";
            directories.map(directory => {
                if ( directory === "" ) {
                    currentPath = rootPath
                } else {
                    currentPath = Path.join( currentPath, directory )
                }
                currentPath = Path.normalize( currentPath );
                let dirListing = this._getDirectoryListing( currentPath );
                list.push({path: currentPath, files: dirListing.files, error: dirListing.error});
            })
        }
        const hokeyHandlers = handlers( this, list, path, selected );

        return (
            <div className="explorer">
                <div className="explorer-header">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="back"><strong>Back</strong>( <i className="fa fa-arrow-left"/> ) </Tooltip>}>
                        <a className="actions"><i className="fa fa-chevron-left fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="forward"><strong>Forward</strong>( <i className="fa fa-arrow-right"/> ) </Tooltip>}>
                        <a className="actions"><i className="fa fa-chevron-right fa-fw"/></a>
                    </OverlayTrigger>
                    <div className="spacer-md"/>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="trash"><strong>Delete</strong>( cmd + delete ) </Tooltip>}>
                        <a className="actions" onClick={hokeyHandlers.delete}><i className="fa fa-trash-o fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="rename"><strong>Rename</strong>( enter ) </Tooltip>}>
                        <a className="actions" onClick={hokeyHandlers.rename}><i className="fa fa-pencil-square-o fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="favorites"><strong>Add to favorites</strong> </Tooltip>}>
                        <a className="actions" onClick={( e ) => {
                            e.preventDefault( );
                            linkAdd( 'default', selected
                                ? Path.join( path, selected )
                                : path );
                        }}><i className="fa fa-star-o fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="preview" > <strong>Preview</strong>( space ) </Tooltip>}>
                        <a className="actions" onClick={( e ) => {
                            e.preventDefault( );
                            this.setState({ previewModalIsOpen: true })
                        }}><i className="fa fa-eye fa-fw"/></a>
                    </OverlayTrigger>
                </div>
                <div className="column favorites">
                    <Favorites selectPath={this._selectPath} {...this.props}/>
                </div>
                <HotKeys keyMap={keyMap} handlers={hokeyHandlers}>
                    <div className="columns-wrapper" ref="columns">
                        {list.map(( directory, i ) => {
                            return (
                                <div className={(( selected && path === directory.path ) || ( !selected && Path.join( path, '..' ) === directory.path ))
                                    ? 'column active'
                                    : 'column'} key={i}>
                                    <Column directory={directory} currentPath={path} selectPath={this._selectPath} settings={settings} isLast={i === list.length - 1} selectedFile={selected}/>
                                </div>
                            )
                        })}

                    </div>
                </HotKeys>
                <div className="explorer-footer">{path}</div>

                <Preview previewModalIsOpen={this.state.previewModalIsOpen} handleClose={( ) => {
                    this.setState({ previewModalIsOpen: false })
                }} path={path} selected={selected}/>
            </div>
        );
    }

    _getDirectoryListing( path ) {
        try{
            let files = fs.readdirSync( path ) || [ ];
            if ( !settings.view.showHidden ) {
                files = files.filter( file => file.charAt( 0 ) !== '.' );
            }
            return {
                files: files.sort(( a, b ) => a.toLowerCase().localeCompare(b.toLowerCase()))
            };
        }catch(ex){
            console.log(`Failed to list directory files. path=${path}, caused by: ${ex}`);
            return {
                files: [],
                error: "Permission denied"
            };
        }
    }

    _selectPath = ( path = '/', selected = null ) => {
        this.props.router.replace({
            pathname: '/',
            query: {
                path: Path.normalize( path ),
                selected: selected
            }
        })
    }

    _openPreviewModal = () => {
        this.setState({ previewModalIsOpen: true })
    }
}
