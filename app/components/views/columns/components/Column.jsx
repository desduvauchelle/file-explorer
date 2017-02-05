import React, { Component, PropTypes } from 'react'
import ColumnFileItem from './ColumnFileItem'
import Path from 'path'
import { DropTarget } from 'react-dnd'
import fs from 'fs'
import DraggableTypes from './DraggableTypes'
import { NativeTypes } from 'react-dnd-html5-backend'

const columnFileItemTarget = {
    drop(props, monitor) {
        const monitorItem = monitor.getItem();
        const destinationFilePath = props.directory.path;
        if (monitorItem.files) {
            let counter = 0;
            for (var k in monitorItem.files) {
                let currentFile = monitorItem.files[k];
                const newName = Path.join(destinationFilePath, currentFile.name);
                fs.rename(currentFile.path, newName, function(err) {
                    if (err) {
                        /* eslint-disable */
                        console.log(`Error moving file ${currentFile.path} to ${newName}, reason:`);
                        console.log(err);
                        /* esling-enable */
                        return;
                    }
                    counter++;
                    if (counter === monitorItem.files.length) {
                        props.forceRefresh();
                    }
                })
            }
        } else {
            const draggedFilePath = monitorItem.filePath;
            const draggedFileParse = Path.parse(draggedFilePath);
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
    }
};

@DropTarget([DraggableTypes.FILE, NativeTypes.FILE], columnFileItemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOverCurrent: monitor.isOver({
        shallow: true
    })
}))
export default class Column extends Component {
    static propTypes = {
        directory: PropTypes.object.isRequired,
        selectPath: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
        forceRefresh: PropTypes.func,
        connectDropTarget: PropTypes.func.isRequired,
        isOverCurrent: PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {directory, selectPath, path, selected, forceRefresh, connectDropTarget, isOverCurrent} = this.props;

        return connectDropTarget(
            <div style={{
                height: '100%'
            }}
                 className={isOverCurrent ? 'column-hovered' : ''}>
                <section>
                    {directory.error && (
                     <p className="alert alert-danger">
                         {directory.error}
                     </p>
                     )}
                    {directory.files.length === 0 && !directory.error && (
                     <p className="alert alert-info">
                         No files
                     </p>
                     )}
                    {directory.files.map((file) => {
                         const currentPath = selected ? Path.join(path, selected) : path;
                         const filePath = Path.join(directory.path, file);
                         const isSelected = directory.isCurrent ? currentPath === filePath : currentPath.indexOf(filePath) !== -1;
                         return (
                             <ColumnFileItem key={filePath}
                                             forceRefresh={forceRefresh}
                                             file={filePath}
                                             isSelected={isSelected}
                                             selectPath={selectPath} />
                             );
                     })}
                </section>
            </div>
        );
    }

}
