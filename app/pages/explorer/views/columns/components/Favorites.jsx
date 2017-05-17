import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'react/lib/update'
import FavoritesGroup from './FavoritesGroup'
import ReduxBinder from 'alias-redux/ReduxBinder'
import FavoritesNewGroupModal from './FavoritesNewGroupModal'

class Favorites extends Component {
    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            newGroupModalIsOpen: false
        }
    }

    render() {
        const {state, actions} = this.props;
        const favorites = state.favorites;

        return (
            <div>
                {favorites.map((favorite, i) => {
                     return (
                         <FavoritesGroup key={favorite.id}
                                         index={i}
                                         favorite={favorite}
                                         actions={actions}
                                         state={state}
                                         reorderFavoritesGroup={this._reorderFavoritesGroup.bind(this)}
                                         addFavorite={this._addFavorite.bind(this)} />
                     )
                 })}
                <br />
                <a onClick={this._newGroupModalToggle.bind(this)}
                   className="new"><i className="fa fa-plus fa-fw" /> New group</a>
                <FavoritesNewGroupModal isOpen={this.state.newGroupModalIsOpen}
                                        onHide={this._newGroupModalToggle.bind(this)}
                                        actions={actions} />
            </div>
            );
    }

    _newGroupModalToggle(e) {
        if (e) {
            e.preventDefault()
        }
        this.setState({
            newGroupModalIsOpen: !this.state.newGroupModalIsOpen
        });
    }

    _reorderFavoritesGroup(dragIndex, hoverIndex, favorite) {
        let newFavorites = update({
            favorites: this.props.state.favorites
        }, {
            favorites: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, favorite]
                ]
            }
        });
        this.props.actions.favorites.sectionReorder(newFavorites.favorites);
    }

    _addFavorite(groupId, filePath) {
        this.props.actions.favorites.linkAdd(groupId, filePath);
    }

}

export default ReduxBinder(Favorites, {
    state: ['favorites', 'fileExplorer']
})