import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

export default class FavoritesNewGroupModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            newGroupName: ''
        }
    }
    render() {
        const {isOpen, onHide} = this.props;
        return (
            <Modal show={isOpen}
                   onHide={() => {
                               this.setState({
                                   newGroupName: ''
                               });
                               onHide();
                           }}
                   bsSize="sm">
                <form onSubmit={this._onSubmitForm.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            New group
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <input type="text"
                                   ref="newGroupName"
                                   placeholder="Enter new group name..."
                                   className="form-control"
                                   value={this.state.newGroupName}
                                   autoFocus
                                   onChange={(e) => {
                                                 this.setState({
                                                     newGroupName: e.target.value
                                                 })
                                             }} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit"
                                className="btn btn-primary btn-block">
                            Create
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
            );
    }

    _onSubmitForm(e) {
        e.preventDefault();
        this.props.actions.favorite.sectionAdd({
            name: this.state.newGroupName
        });
        this.setState({
            newGroupName: ''
        });
        this.props.onHide();
    }
}