import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Path from 'path'
import FavoritesNewGroupModal from './FavoritesNewGroupModal'

export default class Column extends Component {
    static propTypes = {
        hokeyHandlers: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
        linkAdd: PropTypes.func.isRequired,
        sectionAdd: PropTypes.func.isRequired,
        goToSettings: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            newGroupModalIsOpen: false
        }
    }

    _newGroupModalToggle(e) {
        if (e) {
            e.preventDefault()
        }
        this.setState({
            newGroupModalIsOpen: !this.state.newGroupModalIsOpen
        });
    }

    render() {
        const {path, selected, hokeyHandlers, linkAdd, goToSettings, actions} = this.props;

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
                                overlay={(<Tooltip id="trash">
                                              <strong>Delete</strong>(cmd + delete)
                                          </Tooltip>)}>
                    <a className="actions"
                       onClick={hokeyHandlers.delete}><i className="fa fa-trash-o fa-fw" /></a>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom"
                                overlay={(<Tooltip id="rename">
                                              <strong>Rename</strong>(Cmd/ctrl + <i className="fa fa-arrow-down" />)
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
                <FavoritesNewGroupModal isOpen={this.state.newGroupModalIsOpen}
                                        onHide={this._newGroupModalToggle.bind(this)}
                                        actions={actions} />
            </div>
            );
    }
}