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
        let { path, file } = this.props.location.query;
        // Get the root of hard drive (in mac, it's / whereas in windows it's C:\\)
        let rootPath = Path.parse( __dirname ).root;
        path = path || rootPath;
        console.log( path, file );

        let list = [ ];
        if ( !path ) {
            list.push({path: rootPath, files: this._getDirectoryListing( rootPath )});
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
                list.push({path: currentPath, files: this._getDirectoryListing( currentPath )});
            })
        }
        const hokeyHandlers = handlers( this, list, path, file );

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
                            linkAdd( 'default', file
                                ? Path.join( path, file )
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
                                <div className={(( file && path === directory.path ) || ( !file && Path.join( path, '..' ) === directory.path ))
                                    ? 'column active'
                                    : 'column'} key={i}>
                                    <Column directory={directory} currentPath={path} selectPath={this._selectPath} settings={settings} isLast={i === list.length - 1} selectedFile={file}/>
                                </div>
                            )
                        })}

                    </div>
                </HotKeys>
                <div className="explorer-footer">{path}</div>

                <Preview previewModalIsOpen={this.state.previewModalIsOpen} handleClose={( ) => {
                    this.setState({ previewModalIsOpen: false })
                }} path={path} file={file}/>
            </div>
        );
    }

    _getDirectoryListing( path ) {
        try{
            let files = fs.readdirSync( path ) || [ ];
            if ( !settings.view.showHidden ) {
                files = files.filter( file => file.charAt( 0 ) !== '.' );
            }
            return files.sort(( a, b ) => a.toLowerCase( ).localeCompare(b.toLowerCase( )));
        }catch(ex){
            console.log(`Failed to list directory files. path=${path}, caused by: ${ex}`);
            return [];
        }
    }

    _selectPath = ( path = '/', file = null ) => {
        this.props.router.replace({
            pathname: '/',
            query: {
                path: Path.normalize( path ),
                file: file
            }
        })
    }

    _openPreviewModal = ( ) => {
        this.setState({ previewModalIsOpen: true })
    }

}
