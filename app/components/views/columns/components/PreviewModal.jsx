import React, { Component, PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import Preview from './Preview'

export default class PreviewModal extends Component {
    static propTypes = {
        previewModalIsOpen: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
        theme: PropTypes.string
    }
    render() {
        const {previewModalIsOpen, onHide, path, selected} = this.props;
        return (
            <Modal show={previewModalIsOpen}
                   onHide={onHide}
                   bsClass={`modal-preview modal`}
                   bsSize="lg"
                   autoFocus={false}>
                <Modal.Body>
                    <Preview path={path}
                             selected={selected}
                             isColumnView={false}
                             previewModalIsOpen={previewModalIsOpen} />
                </Modal.Body>
            </Modal>
            );
    }
}