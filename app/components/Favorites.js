import React, { Component } from 'react';
import path from 'path'

export default class Favorites extends Component {
    constructor( props ) {
        super( props );
    }

    render( ) {
        const { settings, selectPath, currentPath } = this.props;
        const favorites = settings.favorites;
        return (
            <div>
                {favorites.map(( favorite, i ) => {
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
            </div>
        );
    }

}
