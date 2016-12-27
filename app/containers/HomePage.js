import React, { Component } from 'react'
import fs from 'fs'
// Plugins
import { HotKeys } from 'react-hotkeys'
import Path from 'path'
import { shell } from 'electron'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
// Components
import Favorites from '../components/Favorites'
import Column from '../components/Column'
import Preview from '../components/Preview'
// Settings
import settings from '../settings.default.js';
import { keyMap, handlers } from '../utils/keymapping'

export default class HomePage extends Component {
    constructor( props ) {
        super( props );
    }

    state = {
        previewModalIsOpen: false
    }

    componentDidUpdate( ) {
        var itemComponent = this.refs.columns;
        if ( itemComponent ) {
            itemComponent.scrollLeft = itemComponent.scrollWidth;
        }
    }

    render( ) {
        const self = this;
        let { path, file } = this.props.location.query;

        console.log( path, file );
        let columns = [ ];
        let list = [ ];
        if ( !path ) {
            let files = fs.readdirSync( '/' );
            if ( !settings.view.showHidden ) {
                files = files.filter( file => file.charAt( 0 ) !== '.' );
            }
            files.sort(( a, b ) => a.toLowerCase( ).localeCompare(b.toLowerCase( )));
            list.push({ path: '/', files: files })
        } else {
            let directories = path.split( '/' );
            let currentPath = "";
            directories.map(directory => {
                if ( directory === "" ) {
                    currentPath = '/';
                } else {
                    currentPath = currentPath + '/' + directory;
                }
                currentPath = Path.normalize( currentPath );
                let files = fs.readdirSync( currentPath ) || [ ];
                if ( !settings.view.showHidden ) {
                    files = files.filter( file => file.charAt( 0 ) !== '.' );
                }
                files.sort(( a, b ) => a.toLowerCase( ).localeCompare(b.toLowerCase( )));
                list.push({ path: currentPath, files: files });
            })
        }

        // console.log( list );
        return (
            <div className="explorer">
                <div className="explorer-header">
                    <OverlayTrigger placement="bottom" overlay={< Tooltip id = "back" > <strong>Back</strong>( <i className="fa fa-arrow-left"/> ) < /Tooltip>}>
                        <a className="actions"><i className="fa fa-chevron-left fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={< Tooltip id = "forward" > <strong>Forward</strong>( <i className="fa fa-arrow-right"/> ) < /Tooltip>}>
                        <a className="actions"><i className="fa fa-chevron-right fa-fw"/></a>
                    </OverlayTrigger>

                    <div className="spacer-sm"/>
                    <OverlayTrigger placement="bottom" overlay={< Tooltip id = "trash" > <strong>Delete</strong>( cmd + delete ) < /Tooltip>}>
                        <a className="actions"><i className="fa fa-trash-o fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={< Tooltip id = "rename" > <strong>Rename</strong>( enter ) < /Tooltip>}>
                        <a className="actions"><i className="fa fa-pencil-square-o fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={< Tooltip id = "favorites" > <strong>Add to favorites</strong> < /Tooltip>}>
                        <a className="actions"><i className="fa fa-star-o fa-fw"/></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={< Tooltip id = "preview" > <strong>Preview</strong>( space ) < /Tooltip>}>
                        <a className="actions" onClick={( e ) => {
                            e.preventDefault( );
                            this.setState({ previewModalIsOpen: true })
                        }}><i className="fa fa-eye fa-fw"/></a>
                    </OverlayTrigger>
                </div>
                <div className="column favorites">
                    <Favorites currentPath={path} selectPath={this._selectPath} settings={settings}/>
                </div>
                <HotKeys keyMap={keyMap} handlers={handlers( self, list, path, file )}>
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

    _selectPath = ( path = '/', file ) => {
        // console.log( `New path is  ${ path }` );
        // console.log( this );
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
