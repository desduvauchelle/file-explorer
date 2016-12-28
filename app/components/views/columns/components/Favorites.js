import React, { Component, PropTypes } from 'react';
import path from 'path'
import { Modal } from 'react-bootstrap'

export default class Favorites extends Component {
    static propTypes = {
        selectPath: PropTypes.func.isRequired,
        favorites: PropTypes.object.isRequired
    }

    constructor( props ) {
        super( props );

        this.state = {
            newGroupModalIsOpen: false,
            newGroupName: ''
        }
    }

    render( ) {
        const { selectPath, favorites } = this.props;
        return (
            <div>
                {favorites.favorites.map(( favorite, i ) => {
                    return (
                        <div key={i}>
                            <header>
                                {favorite.name}
                            </header>
                            <section>
                                {favorite.links.map(( link, k ) => {
                                    return (
                                        <a key={k} onClick={( e ) => {
                                            e.preventDefault( );
                                            selectPath( link )
                                        }}><i className="fa fa-folder-o fa-fw left"/>{path.basename( link )}</a>
                                    )
                                })}
                            </section>
                        </div>
                    )
                })}
                <a onClick={( e ) => {
                    e.preventDefault( );
                    this.setState({ newGroupModalIsOpen: true })
                }}><i className="fa fa-plus fa-fw"/>Add group</a>

                <Modal show={this.state.newGroupModalIsOpen} onHide={( ) => {
                    this.setState({ newGroupModalIsOpen: false })
                }} bsSize="sm">
                    <form onSubmit={( e ) => {
                        e.preventDefault( );
                        this.props.sectionAdd({ name: this.state.newGroupName });
                        this.setState({ newGroupModalIsOpen: false, newGroupName: '' });
                    }}>
                        <Modal.Header closeButton>
                            <Modal.Title>New group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <p>Enter a new group name</p>
                                <input type="text" ref="newGroupName" className="form-control" value={this.props.newGroupName} onChange={( ) => {
                                    this.setState({ newGroupName: this.refs.newGroupName.value })
                                }}/>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="submit" className="btn btn-primary">Create</button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }

}
