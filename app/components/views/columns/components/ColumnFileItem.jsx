import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DraggableTypes from './DraggableTypes'
import FileItem from './FileItem'
import { getInfo } from '../../../../utils/fileSystemTools.js'
import fs from 'fs'
import Path from 'path'
// Drag and drop
import { DragSource, DropTarget } from 'react-dnd'

const columnFileItemSource = {
    beginDrag(props) {
        return {
            filePath: props.file
        };
    }
};

const columnFileItemTarget = {
    canDrop(props) {
        const destinationFilePath = props.file;
        const destinationInfo = getInfo(destinationFilePath);
        return destinationInfo.isDirectory;
    },
    drop(props, monitor) {
        const draggedFilePath = monitor.getItem().filePath;
        const destinationFilePath = props.file;
        const destinationInfo = getInfo(destinationFilePath);

        if (!destinationInfo.isDirectory) {
            return;
        }
        const draggedFileParse = Path.parse(draggedFilePath);
        if (destinationFilePath === draggedFileParse.dir) {
            return;
        }
        const newName = Path.join(destinationFilePath, draggedFileParse.base);
        fs.rename(draggedFilePath, newName, function(err) {
            if (err) {
                /* eslint-disable */
                console.log(`Error moving file ${draggedFilePath} to ${destinationFilePath}, reason:`);
                console.log(err);
                /* esling-enable */
                return;
            }
            props.forceRefresh();
        })
    }
};

@DropTarget(DraggableTypes.FILE, columnFileItemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOverCurrent: monitor.isOver()
}))
@DragSource(DraggableTypes.FILE, columnFileItemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class ColumnFileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        selectPath: PropTypes.func.isRequired,
        isSelected: PropTypes.bool.isRequired,
        // For drag and drop
        forceRefresh: PropTypes.func.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        isOverCurrent: PropTypes.bool.isRequired
    }
    render() {
        const {file, selectPath, isSelected, isOverCurrent, isDragging, connectDragSource, connectDropTarget} = this.props;

        return connectDragSource(connectDropTarget(
            <div className={isOverCurrent ? 'file-hovered' : ''}>
                <FileItem file={file}
                          isSelected={isSelected}
                          selectPath={selectPath}
                          isFavorite={false}
                          isDragging={isDragging} />
            </div>
        ));
    }
}
