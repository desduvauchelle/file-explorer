import React, { Component, PropTypes } from 'react'
import DraggableTypes from './DraggableTypes'
import FileItem from './FileItem'
// Drag and drop
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

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

@DropTarget(DraggableTypes.FAVORITE_LINK, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(DraggableTypes.FAVORITE_LINK, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class FavoriteFileItem extends Component {
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
