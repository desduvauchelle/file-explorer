import React, { Component, PropTypes } from 'react'
import Path from 'path'
import ReactPlayer from 'react-player'
import fs from 'fs'
// import PSD from 'psd'
import Prism from "../../../../utils/prism"

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

const codeTypes = [
    {
        name: 'javascript',
        extensions: ['js']
    },
    {
        name: 'jsx',
        extensions: ['jsx']
    },
    {
        name: 'json',
        extensions: ['json']
    },
    {
        name: 'html',
        extensions: ['html']
    },
    {
        name: 'php',
        extensions: ['php']
    },
    {
        name: 'css',
        extensions: ['css']
    },
    {
        name: 'less',
        extensions: ['less']
    },
    {
        name: 'scss',
        extensions: ['scss']
    },
    {
        name: 'sass',
        extensions: ['sass']
    },
    {
        name: 'markup',
        extensions: ['md']
    }
]

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
        //
        let text = "";
        try {
            text = fs.readFileSync(filePath).toString();
        } catch (ex) {
            /* eslint-disable */
            console.log(`Error loading preview for ${filePath}, reason ${ex}`);
        /* eslint-enable */
        }
        //
        const fileParse = Path.parse(filePath);
        const fileExtension = fileParse.ext.substr(1);
        let codeType = null;
        if (Prism.languages[fileExtension]) {
            text = Prism.highlight(text, Prism.languages[fileExtension]);
            codeType = fileExtension === 'js' ? 'javascript' : fileExtension;
        }

        if (codeType) {
            return (
                <div className="text prism">
                    <pre className={`language-${codeType}`}><code className={`language-${codeType}`}
                                                              dangerouslySetInnerHTML={{
                                                                                           __html: text
                                                                                       }}></code></pre>
                </div>
            )
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
        const {path, selected} = this.props;
        this.filePath = Path.join(path, selected);
    }

    render() {
        return (<img src={this.filePath}
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