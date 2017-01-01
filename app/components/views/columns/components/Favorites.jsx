import React, { Component, PropTypes } from 'react';
import swal from 'sweetalert2'
import FavoriteFileItem from './FavoritesFileItem'
import update from 'react/lib/update'

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
        const {selectPath, state} = this.props;
        const favorites = state.favorites;

        return (
            <div>
                {favorites.map((favorite, i) => {
                     return (
                         <div key={i}>
                             <header>
                                 {favorite.name}
                                 <div className="right">
                                     {favorite.id !== 'default' && (
                                      <a className="remove"
                                         onClick={this._removeGroup.bind(this, favorite)}><i className="fa fa-trash-o" /></a>
                                      )}
                                     <a className="visibility"
                                        onClick={this._toggleVisibility.bind(this, favorite)}>
                                         {favorite.isOpen ? 'hide' : 'show'}
                                     </a>
                                 </div>
                             </header>
                             <section className={favorite.isOpen ? 'open' : 'closed'}>
                                 {favorite.links.map((link, k) => {
                                      return (
                                          <FavoriteFileItem key={link.id}
                                                            reorderFavoriteLink={this._reorderFavoriteLink}
                                                            index={k}
                                                            favorite={favorite}
                                                            file={link.link}
                                                            fileId={link.id}
                                                            selectPath={selectPath} />
                                          );
                                  })}
                             </section>
                         </div>
                     )
                 })}
            </div>
            );
    }

    _reorderFavoriteLink = (dragIndex, hoverIndex, fileId, favoriteId) => {
        // NOTE: Keep favoriteID so that we can then drag and drop favorite links into other groups
        const favoriteLinks = this.props.state.favorites.filter(fav => fav.id === favoriteId)[0].links;
        const draggedLink = favoriteLinks[dragIndex];
        // Remove dragged link
        let newLinks = {
            links: favoriteLinks
        }
        newLinks = update(newLinks, {
            links: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, draggedLink]
                ]
            }
        });
        this.props.actions.favorite.sectionEdit(favoriteId, newLinks);
    }

    _removeGroup(favorite) {
        const {sectionRemove} = this.props.actions.favorite;
        swal({
            title: "Are you sure?",
            text: "You will not be able to undo this",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!"
        }).then(function() {
            sectionRemove(favorite.id);
        });
    }

    _toggleVisibility(favorite) {
        this.props.actions.favorite.sectionEdit(favorite.id, {
            isOpen: !favorite.isOpen
        })
    }
}
