import React, { Component, PropTypes } from 'react';
import FileItem from './FileItem'
import swal from 'sweetalert2'
// Drag and drop
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
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
                                          <SortableFileItem key={link.id}
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
}

const ItemTypes = {
    FAVORITE: 'FAVORITE'
}

const cardSource = {
    beginDrag(props) {
        return {
            favoriteId: props.favorite.id,
            fileId: props.fileId,
            index: props.index
        };
    }
};

const cardTarget = {
    hover(props, monitor, component) {
        const item = monitor.getItem();
        const favoriteId = item.favoriteId;
        const dragIndex = item.index;
        const fileId = item.fileId;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.reorderFavoriteLink(dragIndex, hoverIndex, fileId, favoriteId);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

@DropTarget(ItemTypes.FAVORITE, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.FAVORITE, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
class SortableFileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        selectPath: PropTypes.func.isRequired,
        // For drag and drop
        reorderFavoriteLink: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    }
    render() {
        const {file, selectPath} = this.props;
        const {isDragging, connectDragSource, connectDropTarget} = this.props;

        return connectDragSource(connectDropTarget(
            <div>
                <FileItem file={file}
                          isSelected={false}
                          selectPath={selectPath}
                          isFavorite={true}
                          isDragging={isDragging} />
            </div>
        ));
    }
}
