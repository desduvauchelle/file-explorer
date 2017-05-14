import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Path from 'path'
import ReactPlayer from 'react-player'
import fs from 'fs'
// import PDF from 'react-pdf'
// import PSD from 'psd'
import Prism from "../../../../utils/prism"

const previewTypes = {
    image: ['png', 'jpeg', 'jpg', 'gif', 'tiff', 'bmp', 'svg'],
    audioVisual: ['wav', 'mp3', 'aac', 'mp4', 'ogg', 'm4r', 'mkv', 'wmv', 'mov', 'aiff', 'm4a', 'wma', 'avi'],
    text: ['js', 'html', 'css', 'jsx', 'txt', 'md', 'yml', 'json', 'plist', 'sh']
}
//   pdf: ['pdf'],
//     psd: ['psd']

export default class Preview extends Component {
    static propTypes = {
        selected: PropTypes.string,
        path: PropTypes.string.isRequired,
        previewModalIsOpen: PropTypes.bool.isRequired,
        isColumnView: PropTypes.bool
    }

    constructor(props) {
        super(props);
    }

    render() {
        let {path, selected, previewModalIsOpen, isColumnView} = this.props;

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
                                                         isColumnView={isColumnView}
                                                         previewModalIsOpen={previewModalIsOpen} />)}
                {/* type === 'psd' && (<PSDViewer path={path} selected={selected} />) */}
                {/*type === 'pdf' && (<PDFViewer path={path} selected={selected} />)*/}
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
        let fileExtension = fileParse.ext.substr(1);
        let codeType = null;
        switch (fileExtension) {
            case 'js':
                fileExtension = 'javascript';
                break;
            case 'md':
                fileExtension = 'markdown';
                break;
        }
        if (Prism.languages[fileExtension]) {
            text = Prism.highlight(text, Prism.languages[fileExtension]);
            codeType = fileExtension;
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
    }

    render() {
        const {path, selected} = this.props;
        this.filePath = Path.join(path, selected);
        return (<img src={this.filePath}
                     className="image" />);
    }
}

class PSDViewer extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired
    }
    constructor(props) {
        super(props);
        const {path, selected} = this.props;
        const filePath = Path.join(path, selected);
        this.state = {
            imgToPng: null,
            filePath: filePath
        }
    }

    componenrDidMount() {
        this._psdToImg();
    }
    componentWillReceiveProps(newProps) {
        const {path, selected} = newProps;
        const filePath = Path.join(path, selected);
        if (filePath !== this.state.filePath) {
            this.setState({
                filePath: filePath
            });
            this._psdToImg();
        }
    }

    _psdToImg() {
        PSD.open(this.state.filePath).then((psd) => {
            this.setState({
                imgToPng: psd.image.toPng()
            });
        });
    }

    render() {
        const {imgToPng} = this.state;
        if (!imgToPng) {
            return (<p>
                        Loading...
                    </p>);
        }
        return (<img src={imgToPng}
                     className="image" />);
    }
}

class AudioVisual extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired,
        previewModalIsOpen: PropTypes.bool.isRequired,
        isColumnView: PropTypes.bool.isRequired
    }
    constructor(props) {
        super(props)
    }

    render() {
        const {path, selected, previewModalIsOpen, isColumnView} = this.props;

        return (
            <div className="video">
                <ReactPlayer url={Path.join(path, selected)}
                             playing={isColumnView ? false : previewModalIsOpen}
                             controls={true} />
            </div>
            );
    }
}

class PDFViewer extends React.Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            currentPage: null,
            page: null
        }
    }

    render() {
        const {currentPage} = this.state;
        const {path, selected} = this.props;
        const filePath = Path.join(path, selected);

        return <PDF file={filePath}
                    page={currentPage}
                    scale="1.0"
                    onDocumentComplete={this._onDocumentComplete.bind(this)}
                    onPageComplete={this._onPageComplete.bind(this)}
                    loading={(<span>Your own loading message ...</span>)} />
    }
    _onDocumentCompleted(pages) {
        this.setState({
            pages: pages
        });
    }
    _onPageCompleted(page) {
        this.setState({
            currentPage: page
        });
    }
}