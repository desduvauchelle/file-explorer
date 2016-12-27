// @flow
import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import Path from 'path'
import { Modal } from 'react-bootstrap'
import ReactPlayer from 'react-player'
// const swarl = ( ) => {}

import settings from '../settings.default.js';

import { keyMap, handlers } from '../utils/keymapping'

export default class Preview extends Component {
    constructor( props ) {
        super( props );
    }

    render( ) {
        const self = this;
        let { path, file, previewModalIsOpen, handleClose } = this.props;

        return (
            <Modal show={previewModalIsOpen} onHide={handleClose} bsSize="lg">
                <Modal.Body>
                    <div className="preview">
                        {( file && [ '.png', '.jpeg', '.jpg', '.gif' ].indexOf(Path.extname( file ).toLowerCase( )) !== -1 ) && ( <img src={Path.join( path, file )} className="image"/> )}
                        {( file && [
                            '.wav',
                            '.mp3',
                            '.aac',
                            '.mp4',
                            '.ogg',
                            '.m4r',
                            '.mkv'
                        ].indexOf(Path.extname( file ).toLowerCase( )) !== -1 ) && ( <ReactPlayer url={Path.join( path, file )} playing={previewModalIsOpen} controls={true} width={880} height={510}/> )}
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

}
