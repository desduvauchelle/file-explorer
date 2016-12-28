import React, { Component } from 'react'
import Path from 'path'
import { Modal } from 'react-bootstrap'
import ReactPlayer from 'react-player'
// import PSD from 'psd'

export default class Preview extends Component {
    constructor( props ) {
        super( props );
    }

    render( ) {
        let { path, file, previewModalIsOpen, handleClose } = this.props;

        return (
            <Modal show={previewModalIsOpen} onHide={handleClose} bsClass="modal-preview modal" bsSize="lg" onKeyPress={( e ) => {
                if ( e.keyCode == 0 ) {
                    handleClose( );
                }
            }}>
                <Modal.Body>
                    <div className="preview">
                        {/* IMAGE */}
                        {( file && [ '.png', '.jpeg', '.jpg', '.gif' ].indexOf(Path.extname( file ).toLowerCase( )) !== -1 ) && ( <img src={Path.join( path, file )} className="image"/> )}
                        {/* VIDEO & AUDIO  */}
                        {( file && [
                            '.wav',
                            '.mp3',
                            '.aac',
                            '.mp4',
                            '.ogg',
                            '.m4r',
                            '.mkv'
                        ].indexOf(Path.extname( file ).toLowerCase( )) !== -1 ) && (
                            <div className="video"><ReactPlayer url={Path.join( path, file )} playing={previewModalIsOpen} controls={true}/></div>
                        )}
                        {/* PHOTOSHOP */}
                        {/* {( file && [ '.psd' ].indexOf(Path.extname( file ).toLowerCase( )) !== -1 ) && PSD.fromURL( "/path/to/file.psd" ).then( function ( psd ) {
                            return ( <img src={psd.image.toPng( )} className="image"/> )
                        })} */}
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

}
