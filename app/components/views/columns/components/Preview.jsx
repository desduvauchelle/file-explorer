import React, { Component, PropTypes } from 'react'
import Path from 'path'
import ReactPlayer from 'react-player'
import fs from 'fs'
// import PSD from 'psd'

const previewTypes = {
    image: ['png', 'jpeg', 'jpg', 'gif', 'tiff', 'bmp', 'svg'],
    audioVisual: ['wav', 'mp3', 'aac', 'mp4', 'ogg', 'm4r', 'mkv', 'wmv', 'mov', 'aiff', 'm4a', 'wma', 'avi'],
    text: ['js', 'html', 'css', 'jsx', 'txt', 'md', 'yml', 'json', 'plist']
}

export default class Preview extends Component {
    static propTypes = {
        selected: PropTypes.string,
        path: PropTypes.string.isRequired,
        previewModalIsOpen: PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        let {path, selected, previewModalIsOpen} = this.props;

        let type = 'unknown';
        if (selected) {
            const extension = Path.extname(selected).toLowerCase().substr(1);
            for (var k in previewTypes) {
                if (previewTypes[k].indexOf(extension) !== -1) {
                    type = k;
                }
            }
        }

        return (
            <div className="preview">
                {type === 'unknown' && (<Unknown path={path}
                                                 selected={selected} />)}
                {type === 'image' && (<Image path={path}
                                             selected={selected} />)}
                {type === 'text' && (<Text path={path}
                                           selected={selected} />)}
                {type === 'audioVisual' && (<AudioVisual path={path}
                                                         selected={selected}
                                                         previewModalIsOpen={previewModalIsOpen} />)}
            </div>
            );
    }
}

class Unknown extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired
    }
    constructor(props) {
        super(props)
    }

    render() {
        const {selected} = this.props;

        return (
            <div className="unknown">
                <i className="icon-file"
                   data-name={selected} />
            </div>
            );
    }
}

class Text extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired
    }
    constructor(props) {
        super(props)
    }

    render() {
        const {path, selected} = this.props;
        const filePath = Path.join(path, selected);
        let text = "";
        try {
            text = fs.readFileSync(filePath).toString();
        } catch (ex) {
            console.log(`Error loading preview for ${filePath}, reason ${ex}`);
        }

        return (
            <div className="text">
                <pre><code>{text}</code></pre>
            </div>
            );
    }
}

class Image extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired
    }
    constructor(props) {
        super(props)
    }

    render() {
        const {path, selected} = this.props;

        return (<img src={Path.join(path, selected)}
                     className="image" />);
    }
}

class AudioVisual extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired,
        previewModalIsOpen: PropTypes.bool.isRequired
    }
    constructor(props) {
        super(props)
    }

    render() {
        const {path, selected, previewModalIsOpen} = this.props;

        return (
            <div className="video">
                <ReactPlayer url={Path.join(path, selected)}
                             playing={previewModalIsOpen}
                             controls={true} />
            </div>
            );
    }
}