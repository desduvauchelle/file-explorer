import React, { Component, PropTypes } from 'react'
import Path from 'path'
import { shell } from 'electron'
import { getInfo } from '../../../../utils/fileSystemTools.js'
// Drag and drop
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

const ItemTypes = {
    CARD: 'CARD'
}

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            isFavorite: props.isFavorite
        };
    }
};

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
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
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
class FileItem extends Component {
    static propTypes = {
        file: PropTypes.string.isRequired,
        selectPath: PropTypes.func.isRequired,
        isSelected: PropTypes.bool,
        isFavorite: PropTypes.bool,
        handleClick: PropTypes.func,
        handleDoubleClick: PropTypes.func,
        handleDoubleClickFolder: PropTypes.func,
        // For drag and drop
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        moveCard: PropTypes.func
    };

    static defaultProps = {
        file: "",
        isSelected: false,
        isFavorite: false,
        handleClick: (self, file = "") => {
            if (self.isDirectory) {
                self.props.selectPath(file);
                return;
            }
            self.props.selectPath(self.fileParse.dir, self.fileParse.base);
        },
        handleDoubleClick: (file = "") => {
            shell.openItem(file)
        },
        handleDoubleClickFolder(file = "", isMacApp = false) {
            if (isMacApp) {
                shell.openItem(file);
                return;
            }
            shell.showItemInFolder(file);
        }
    }

    constructor(props) {
        super(props);
        const {file} = this.props;
        this.directoryInfo = getInfo(file);
        this.isDirectory = this.directoryInfo.isDirectory;
        //
        this.fileParse = Path.parse(file);
        this.displayName = this.fileParse.base;
        //
        this.isMacApp = false;
        if (this.isDirectory && this.fileParse.ext === ".app") {
            this.displayName = this.displayName.replace('.app', '');
            this.isMacApp = true;
        }
    }

    render() {
        const {file, isSelected, isFavorite, handleClick, handleDoubleClick, handleDoubleClickFolder} = this.props;
        const {isDragging, connectDragSource, connectDropTarget} = this.props;

        return connectDragSource(connectDropTarget(
            <a onClick={handleClick.bind(this, this, file)}
               onDoubleClick={!this.isDirectory ? handleDoubleClick.bind(this, file) : handleDoubleClickFolder.bind(this, file, this.isMacApp)}
               className={`${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}><i className={this.isDirectory ? `icon-file-directory ${isSelected ? 'open' : ''} left` : 'icon-file left'}
                                                                                                                 data-name={this.displayName} />
                {this.displayName}
                {(!isFavorite && (this.isDirectory && !this.isMacApp)) && (<i className="fa fa-caret-right right" />)}
            </a>
        ));
    // return (
    //     <a onClick={handleClick.bind(this, this, file)}
    //        onDoubleClick={!this.isDirectory ? handleDoubleClick.bind(this, file) : handleDoubleClickFolder.bind(this, file, this.isMacApp)}
    //        className={isSelected ? 'selected' : ''}><i className={this.isDirectory ? `icon-file-directory ${isSelected ? 'open' : ''} left` : 'icon-file left'}
    //                                                                                                          data-name={this.displayName} />
    //         {this.displayName}
    //         {(!isFavorite && (this.isDirectory && !this.isMacApp)) && (<i className="fa fa-caret-right right" />)}
    //     </a>
    //     );
    }
}

export default FileItem;
