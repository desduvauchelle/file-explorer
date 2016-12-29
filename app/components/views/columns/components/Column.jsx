import React, { Component, PropTypes } from 'react';
import FileItem from './FileItem.jsx';

export default class Column extends Component {
    static propTypes = {
        directory: PropTypes.object.isRequired,
        selectPath: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        selected: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        const {directory, selectPath, path, selected} = this.props;

        return (
            <section>
              { directory.error && (
                <p className="error">
                  { directory.error }
                </p>
                ) }
              { directory.files.length === 0 && !directory.error && (
                <p>
                  No files
                </p>
                ) }
              { directory.files.map(file => <FileItem key={ file }
                                              isFavorite={ false }
                                              path={ path }
                                              selected={ selected }
                                              file={ file }
                                              directory={ directory }
                                              selectPath={ selectPath } />
                ) }
            </section>
            );
    }

}
