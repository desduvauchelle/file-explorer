import React, { Component, PropTypes } from 'react'
import fs from 'fs'
// Plugins
import { HotKeys } from 'react-hotkeys'
import Path from 'path'
import { Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
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
        router: PropTypes.object.isRequired,
        sectionAdd: PropTypes.func.isRequired,
        sectionRemove: PropTypes.func.isRequired,
        sectionEdit: PropTypes.func.isRequired,
        linkAdd: PropTypes.func.isRequired,
        linkRemove: PropTypes.func.isRequired
    }

    constructor( props ) {
        super( props );
        
        this.state = {
            previewModalIsOpen: false,
            newGroupModalIsOpen: false,
            newGroupName: ''
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
        this.rootPath = Path.parse( __dirname ).root;
        path = path || this.rootPath;
        // Get list of the directories and it's children
        let list = [ ];
        if ( !path ) {
            let dirListing = this._getDirectoryListing( this.rootPath );
            list.push({
                path: this.rootPath, 
                files: dirListing.files, 
                error: dirListing.error, 
                isCurrent: true
            });
        } else {
            let directories = path.split( Path.sep );
            let currentPath = "";
            directories.map(directory => {
                if ( directory === "" ) {
                    currentPath = this.rootPath
                } else {
                    currentPath = Path.join( currentPath, directory )
                }
                currentPath = Path.normalize( currentPath );
                let dirListing = this._getDirectoryListing( currentPath );
                let isCurrent = ( selected && path === currentPath ) || ( !selected && Path.join( path, '..' ) === currentPath );
                
                list.push({
                    path: currentPath, 
                    files: dirListing.files, 
                    error: dirListing.error,
                    isCurrent: isCurrent
                });
            })
        }
        if(selected){
            const filePath = Path.join(path,selected);
            try {
            const isDirectory = fs.statSync( filePath ).isDirectory( );
            if ( isDirectory ) {   
                let dirListing = this._getDirectoryListing(filePath);             
                list.push({
                    path: filePath, 
                    files: dirListing.files, 
                    error: dirListing.error,
                    isCurrent: false
                });
            }
        } catch ( ex ) {
            console.log( `Failed to analyze: ${ filePath }, Caused by: ${ ex }` );
        }
        }
        

        // For key mapping
        const hokeyHandlers = handlers( this, list, path, selected );

        return (
            <div className="explorer">
                <div className="explorer-header">
                    <div className="favorite">
                        <a className="logo"><img src={require('../../../../resources/icons/256x256.png')} /></a>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="newGroup"><strong>New group</strong></Tooltip>}>
                            <a className="actions" onClick={(e)=>{
                                e.preventDefault();
                                this.setState({ newGroupModalIsOpen: true, newGroupName: '' });
                            }}><i className="fa fa-plus fa-fw"/></a>
                        </OverlayTrigger>
                    </div>
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
                            linkAdd( 'default', selected? Path.join( path, selected ): path );
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
                                <div className={directory.isCurrent? 'column active': 'column'} key={i}>
                                    <Column 
                                        directory={directory} 
                                        currentPath={path} 
                                        selectPath={this._selectPath} 
                                        settings={settings} 
                                        selected={selected} />
                                </div>
                            )
                        })}

                    </div>
                </HotKeys>
                <div className="explorer-footer">{path} {selected ? `(${selected})`:''}</div>

                <Preview 
                    previewModalIsOpen={this.state.previewModalIsOpen} 
                    handleClose={( ) => {
                        this.setState({ previewModalIsOpen: false })
                    }} 
                    path={path} 
                    selected={selected}/>

                <Modal show={this.state.newGroupModalIsOpen} onHide={( ) => {
                    this.setState({ newGroupModalIsOpen: false })
                }} bsSize="sm">
                    <form onSubmit={( e ) => {
                        e.preventDefault( );
                        sectionAdd({ name: this.state.newGroupName });
                        this.setState({ newGroupModalIsOpen: false, newGroupName: '' });
                    }}>
                        <Modal.Header closeButton>
                            <Modal.Title>New group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <input type="text" ref="newGroupName" placeholder="Enter new group name..." className="form-control" value={this.props.newGroupName} onChange={( ) => {
                                    this.setState({ newGroupName: this.refs.newGroupName.value })
                                }}/>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="submit" className="btn btn-primary btn-block">Create</button>
                        </Modal.Footer>
                    </form>
                </Modal>
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
        // If no selected, select the first if it's a directory
        if(!selected){
            const currentDirectory = this._getDirectoryListing(path);
            if(currentDirectory.files.length > 0){
                    selected = currentDirectory.files[0];
            }
        }
        
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
