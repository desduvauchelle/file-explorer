import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'react/lib/update'
import FavoritesGroup from './FavoritesGroup'
import ReduxBinder from 'alias-redux/ReduxBinder'

class Favorites extends Component {
    static propTypes = {
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
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
            </div>
            );
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