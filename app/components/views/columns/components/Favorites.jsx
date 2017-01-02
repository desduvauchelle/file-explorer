import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update'
import FavoritesGroup from './FavoritesGroup'

export default class Favorites extends Component {
    static propTypes = {
        selectPath: PropTypes.func.isRequired,
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        moveCard: PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {state, actions, selectPath} = this.props;
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
                                         addFavorite={this._addFavorite.bind(this)}
                                         selectPath={selectPath} />
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
        this.props.actions.favorite.sectionReorder(newFavorites.favorites);
    }

    _addFavorite(groupId, filePath) {
        this.props.actions.favorite.linkAdd(groupId, filePath);
    }

}
