import React, { Component, PropTypes } from 'react'
import FileItem from './FileItem.jsx'
import Path from 'path'

export default class Column extends Component {
    static propTypes = {
        directory: PropTypes.object.isRequired,
        selectPath: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string,
        moveCard: PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {directory, selectPath, path, selected, moveCard} = this.props;

        return (
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
                {directory.files.map((file, i) => {
                     const currentPath = selected ? Path.join(path, selected) : path;
                     const filePath = Path.join(directory.path, file);
                     const isSelected = directory.isCurrent ? currentPath === filePath : currentPath.indexOf(filePath) !== -1;
                     return (
                         <FileItem key={filePath}
                                   index={i}
                                   moveCard={moveCard}
                                   file={filePath}
                                   isSelected={isSelected}
                                   selectPath={selectPath} />
                         );
                 })}
            </section>
            );
    }

}
