import React, { Component, PropTypes } from 'react';
import FileItem from './FileItem'
import swal from 'sweetalert2'

export default class Favorites extends Component {
    static propTypes = {
        selectPath: PropTypes.func.isRequired,
        state: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
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
                                          <FileItem key={`${link}-${k}`}
                                                    file={link}
                                                    isSelected={false}
                                                    selectPath={selectPath}
                                                    isFavorite={true} />
                                          );
                                  })}
                             </section>
                         </div>
                     )
                 })}
            </div>
            );
    }

}
