import Path from 'path'
import { shell } from 'electron'
import fs from 'fs'

export default {
    keyMap: {
        'delete': 'del',
        'moveUp': 'up',
        'moveDown': 'down',
        'moveLeft': 'left',
        'moveRight': 'right',
        'copy': ['command+c', 'ctrl+c'],
        'paste': ['command+v', 'ctrl+v'],
        'open': 'enter',
        'rename': ['command+down', 'ctrl+down'],
        'preview': ['space']
    },
    handlers: (self, list, path, selected) => {
        return {
            delete: (e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this file?")) {
                    let fullPath = selected ? Path.join(path, selected) : path;

                    shell.moveItemToTrash(fullPath);
                    self._selectPath(selected ? path : Path.join(path, '..'));
                }
            },
            rename: (e) => {
                e.preventDefault();
                self.setState({
                    renameModalIsOpen: !self.state.renameModalIsOpen
                });
            },
            open: (e) => {
                e.preventDefault();
                if (selected) {
                    shell.openItem(Path.join(path, selected));
                    return;
                }
                shell.showItemInFolder(path);
            },
            preview: (e) => {
                e.preventDefault();
                self.setState({
                    previewModalIsOpen: !self.state.previewModalIsOpen
                });
            },
            moveLeft: (e) => {
                e.preventDefault();
                if (path === self.rootPath) {
                    return;
                }
                let directoryList = path.split(Path.sep);
                self._selectPath(Path.join(path, '..'), directoryList[directoryList.length - 1]);
            },
            moveRight: (e) => {
                e.preventDefault();
                if (!selected) {
                    return;
                }
                const filePath = Path.join(path, selected);
                let isDirectory = false;
                try {
                    isDirectory = fs.statSync(filePath).isDirectory();
                } catch (ex) {
                    /* eslint-disable */
                    console.log(`Failed to analyze: ${ filePath }, Caused by: ${ ex }`);
                /* eslint-enable */
                }

                if (!isDirectory) {
                    shell.openItem(filePath);
                    return;
                }
                self._selectPath(filePath);
            },
            moveDown: (e) => {
                e.preventDefault();
                const directory = list.filter(directory => directory.path === path)[0];
                const currentIndex = directory.files.indexOf(selected);
                if (currentIndex === directory.files.length - 1) {
                    return;
                }
                self._selectPath(path, directory.files[currentIndex + 1]);
            },
            moveUp: (e) => {
                e.preventDefault();
                const directory = list.filter(directory => directory.path === path)[0];
                const currentIndex = directory.files.indexOf(selected);
                if (currentIndex === 0) {
                    return;
                }
                self._selectPath(path, directory.files[currentIndex - 1]);
            }
        };
    }
}
