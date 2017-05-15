import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import fs from 'fs'
import Path from 'path'

export default class FileItemRenameModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        forceRefresh: PropTypes.func.isRequired,
        selected: PropTypes.string
    }
    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            selected: newProps.selected
        })
    }
    render() {
        const {isOpen, onHide} = this.props;
        const {selected} = this.state;
        return (
            <Modal show={isOpen}
                   onHide={onHide}
                   bsSize="sm">
                <form onSubmit={this._onSubmit.bind(this)}>
                    <Modal.Header>
                        Rename file
                        {` "${selected}"`}
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text"
                               value={selected}
                               placeholder={selected}
                               ref="selected"
                               onChange={(e) => {
                                             this.setState({
                                                 selected: e.target.value
                                             })
                                         }}
                               className="form-control"
                               autoFocus={true} />
                    </Modal.Body>
                    <Modal.Footer>
                        <a onClick={onHide}
                           className="btn btn-default">Cancel</a>
                        <button type="submit"
                                className="btn btn-primary">
                            Rename
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
            );
    }

    _onSubmit(e) {
        e.preventDefault();
        const {path, selected} = this.props;
        const newSelected = this.state.selected;
        const oldPath = Path.join(path, selected);
        const newPath = Path.join(path, newSelected);
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                /* eslint-disable */
                console.log("Error renaming a file");
                console.log(err);
            /* eslint-enable */
            }
            this.props.forceRefresh();
            this.props.onHide();
        });
    }
}