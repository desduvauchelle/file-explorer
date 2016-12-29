import React, { Component, PropTypes } from 'react';
import path from 'path'

export default class Favorites extends Component {
    static propTypes = {
        selectPath: PropTypes.func.isRequired,
        favorites: PropTypes.object.isRequired,
        sectionRemove: PropTypes.func.isRequired,
        sectionEdit: PropTypes.func.isRequired
    }

    constructor( props ) {
        super( props );
    }

    render( ) {
        const { selectPath, favorites, sectionRemove, sectionEdit } = this.props;
        return (
            <div>
                {favorites.favorites.map(( favorite, i ) => {
                    return (
                        <div key={i}>
                            <header>
                                {favorite.name}
                                <div className="right">
                                    {favorite.id !== 'default' && (<a className="remove" onClick={(e)=>{e.preventDefault();sectionRemove(favorite.id)}}><i className="fa fa-trash-o" /></a>)}
                                    <a className="visibility" onClick={(e)=>{e.preventDefault(); sectionEdit(favorite.id,{isOpen:!favorite.isOpen})}}>{favorite.isOpen?'hide':'show'}</a>
                                </div>
                            </header>
                            <section className={favorite.isOpen? 'open': 'closed'}>
                                {favorite.links.map(( link, k ) => {
                                    return (
                                        <a key={k} onClick={( e ) => {
                                            e.preventDefault( );
                                            selectPath( link )
                                        }}>
                                            <i className="fa fa-folder-o fa-fw left"/>{path.basename( link )}                                                                                        
                                        </a>
                                    )
                                })}
                            </section>
                        </div>
                    )
                })}                
            </div>
        );
    }

}
