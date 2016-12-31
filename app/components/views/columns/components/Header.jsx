import React, { Component, PropTypes } from 'react';
import { Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Path from 'path'

export default class Column extends Component {
    static propTypes = {
        hokeyHandlers: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
        linkAdd: PropTypes.func.isRequired,
        sectionAdd: PropTypes.func.isRequired,
        goToSettings: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            newGroupModalIsOpen: false,
            newGroupName: ''
        }
    }

    _newGroupModalToggle(e) {
        if (e) {
            e.preventDefault()
        }
        this.setState({
            newGroupModalIsOpen: !this.state.newGroupModalIsOpen,
            newGroupName: ''
        });
    }

    _onSubmitForm(e) {
        e.preventDefault();
        this.props.sectionAdd({
            name: this.state.newGroupName
        });
        this.setState({
            newGroupModalIsOpen: false,
            newGroupName: ''
        });
    }

    render() {
        const {path, selected, hokeyHandlers, linkAdd, goToSettings} = this.props;

        return (
            <div>
                <div className="favorite">
                    <a className="logo"><img src={require('../../../../../resources/icons/256x256.png')} /></a>
                    <OverlayTrigger placement="bottom"
                                    overlay={(<Tooltip id="settings">
                                                  <strong>Settings</strong>
                                              </Tooltip>)}>
                        <a className="actions"
                           onClick={goToSettings}><i className="fa fa-cog fa-fw" /></a>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom"
                                    overlay={(<Tooltip id="newGroup">
                                                  <strong>New group</strong>
                                              </Tooltip>)}>
                        <a className="actions"
                           onClick={this._newGroupModalToggle.bind(this)}><i className="fa fa-plus fa-fw" /></a>
                    </OverlayTrigger>
                </div>
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="back">
                                              <strong>Back</strong>(<i className="fa fa-arrow-left" />)
                                          </Tooltip>)}>
                    <a className="actions"><i className="fa fa-chevron-left fa-fw" /></a>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="forward">
                                              <strong>Forward</strong>(<i className="fa fa-arrow-right" />)
                                          </Tooltip>)}>
                    <a className="actions"><i className="fa fa-chevron-right fa-fw" /></a>
                </OverlayTrigger>
                <div className="spacer-md" />
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="trash">
                                              <strong>Delete</strong>(cmd + delete)
                                          </Tooltip>)}>
                    <a className="actions"
                       onClick={hokeyHandlers.delete}><i className="fa fa-trash-o fa-fw" /></a>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="rename">
                                              <strong>Rename</strong>(enter)
                                          </Tooltip>)}>
                    <a className="actions"
                       onClick={hokeyHandlers.rename}><i className="fa fa-pencil-square-o fa-fw" /></a>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="favorites">
                                              <strong>Add to favorites</strong>
                                          </Tooltip>)}>
                    <a className="actions"
                       onClick={() => {
                                    linkAdd('default', selected ? Path.join(path, selected) : path);
                                }}><i className="fa fa-star-o fa-fw" /></a>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="preview">
                                              <strong>Preview</strong>(space)
                                          </Tooltip>)}>
                    <a className="actions"
                       onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                        previewModalIsOpen: true
                                    })
                                }}><i className="fa fa-eye fa-fw" /></a>
                </OverlayTrigger>
                <Modal show={this.state.newGroupModalIsOpen}
                       onHide={this._newGroupModalToggle.bind(this)}
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
                                       onChange={() => {
                                                     this.setState({
                                                         newGroupName: this.refs.newGroupName.value
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
            </div>
            );
    }

}
