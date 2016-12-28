import React, { Component, PropTypes } from 'react'
import Path from 'path'
import { Modal } from 'react-bootstrap'
import ReactPlayer from 'react-player'
// import PSD from 'psd'

const previewTypes = {
    image: ['.png', '.jpeg', '.jpg', '.gif'],
    audioVisual: ['.wav','.mp3','.aac','.mp4','.ogg','.m4r','.mkv']
}

export default class Preview extends Component {
    static propTypes = {
        selected: PropTypes.string,
        path: PropTypes.string,
        previewModalIsOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired
    }

    constructor( props ) {
        super( props );
    }

    render( ) {
        let { path, selected, previewModalIsOpen, handleClose } = this.props;

        let type = 'unknown';
        if(selected){
             const extension = Path.extname( selected ).toLowerCase( );        
            for(var k in previewTypes){
                if(previewTypes[k].indexOf(extension) !== -1){
                    type = k;
                }
            }
        }

        return (
            <Modal show={previewModalIsOpen} onHide={handleClose} bsClass="modal-preview modal" bsSize="lg" onKeyPress={( e ) => {
                if ( e.keyCode == 0 ) {
                    handleClose( );
                }
            }}>
                <Modal.Body>
                    <div className="preview">
                        {/* IMAGE */}
                        {type === 'image' && (<Image path={path} selected={selected} />)}
                        {/* VIDEO & AUDIO  */}
                        {type === 'audioVisual' && (<AudioVisual path={path} selected={selected} previewModalIsOpen={previewModalIsOpen} />)}
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

class Image extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired
    }
    constructor(props){
        super(props)
    }

    render(){
        const { path, selected} = this.props;

        return (<img src={Path.join( path, selected )} className="image"/>);
    }
}

class AudioVisual extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired,
        previewModalIsOpen: PropTypes.bool.isRequired
    }
    constructor(props){
        super(props)
    }

    render(){
        const { path, selected, previewModalIsOpen} = this.props;

        return (
            <div className="video">
                <ReactPlayer url={Path.join( path, selected )} playing={previewModalIsOpen} controls={true}/>
            </div>
        );
    }
}