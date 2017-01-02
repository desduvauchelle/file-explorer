import React, { Component, PropTypes } from 'react'
import ColumnFileItem from './ColumnFileItem'
import Path from 'path'
import { DropTarget } from 'react-dnd'
import fs from 'fs'
import DraggableTypes from './DraggableTypes'

const columnFileItemTarget = {
    drop(props, monitor, component) {
        const draggedFilePath = monitor.getItem().filePath;
        const destinationFilePath = props.directory.path;

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
};

@DropTarget(DraggableTypes.FILE, columnFileItemTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
export default class Column extends Component {
    static propTypes = {
        directory: PropTypes.object.isRequired,
        selectPath: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
        forceRefresh: PropTypes.func,
        connectDropTarget: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {directory, selectPath, path, selected, forceRefresh, connectDropTarget} = this.props;

        return connectDropTarget(
            <div style={{
                height: '100%'
            }}>
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
