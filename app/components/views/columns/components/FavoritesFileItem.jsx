import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DraggableTypes from './DraggableTypes'
import FileItem from './FileItem'
// Drag and drop
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

const favoriteFileItemSource = {
    beginDrag(props) {
        return {
            favorite: props.favorite,
            favoriteId: props.favorite.id,
            fileId: props.fileId,
            file: props.file,
            index: props.index
        };
    }
};

const favoriteFileItemTarget = {
    hover(props, monitor, component) {
        const item = monitor.getItem();
        const favoriteId = item.favoriteId;
        const dragIndex = item.index;
        const fileId = item.fileId;
        const hoverIndex = props.index;
        if (favoriteId !== props.favorite.id) {
            return;
        }
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
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }
        props.reorderFavoriteLink(dragIndex, hoverIndex, fileId, favoriteId);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

@DropTarget(DraggableTypes.FAVORITE_LINK, favoriteFileItemTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(DraggableTypes.FAVORITE_LINK, favoriteFileItemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class FavoriteFileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        selectPath: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
        favorite: PropTypes.object.isRequired,
        fileId: PropTypes.string.isRequired,
        // For drag and drop
        reorderFavoriteLink: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    }
    render() {
        const {file, selectPath, actions, favorite, fileId} = this.props;
        const {isDragging, connectDragSource, connectDropTarget} = this.props;

        return connectDragSource(connectDropTarget(
            <div>
                <FileItem file={file}
                          isSelected={false}
                          selectPath={selectPath}
                          isFavorite={true}
                          handleRemoveFavorite={() => {
                                                    actions.favorite.linkRemove(favorite.id, fileId);
                                                }}
                          isDragging={isDragging} />
            </div>
        ));
    }
}
