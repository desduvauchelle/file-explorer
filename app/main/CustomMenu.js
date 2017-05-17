import { shell } from 'electron'

export default class CustomMenu {
    constructor(app, mainWindow, customIPC) {
        this.darwinTemplate = this.darwinTemplate(app, mainWindow, customIPC)
        this.defaultTemplate = this.defaultTemplate(app, mainWindow, customIPC)
        //
        //
        this.template = (process.platform === 'darwin') ? this.darwinTemplate : this.defaultTemplate
    }
    darwinTemplate(app, mainWindow, customIPC) {
        return [
            {
                label: 'File explorer',
                submenu: [
                    {
                        label: 'About File explorer',
                        selector: 'orderFrontStandardAboutPanel:'
                    },
                    {
                        label: 'Preferences',
                        accelerator: 'Command+,',
                        click() {
                            customIPC.send('module', {
                                module: 'navigation',
                                action: 'goToPage',
                                data: 'settings'
                            })
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide File explorer',
                        accelerator: 'Command+H',
                        selector: 'hide:'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Shift+H',
                        selector: 'hideOtherApplications:'
                    },
                    {
                        label: 'Show All',
                        selector: 'unhideAllApplications:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click() {
                            app.quit();
                        }
                    }]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Undo',
                        accelerator: 'Command+Z',
                        selector: 'undo:'
                    },
                    {
                        label: 'Redo',
                        accelerator: 'Shift+Command+Z',
                        selector: 'redo:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Cut',
                        accelerator: 'Command+X',
                        selector: 'cut:'
                    },
                    {
                        label: 'Copy',
                        accelerator: 'Command+C',
                        selector: 'copy:'
                    },
                    {
                        label: 'Paste',
                        accelerator: 'Command+V',
                        selector: 'paste:'
                    },
                    {
                        label: 'Select All',
                        accelerator: 'Command+A',
                        selector: 'selectAll:'
                    }]
            },
            {
                label: 'View',
                submenu: (process.env.NODE_ENV === 'development') ?
                    [
                        {
                            label: 'Reload',
                            accelerator: 'Command+R',
                            click() {
                                mainWindow.webContents.reload();
                            }
                        },
                        {
                            label: 'Toggle Full Screen',
                            accelerator: 'Ctrl+Command+F',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        },
                        {
                            label: 'Toggle Developer Tools',
                            accelerator: 'Alt+Command+I',
                            click() {
                                mainWindow.toggleDevTools();
                            }
                        }] :
                    [
                        {
                            label: 'Reload',
                            accelerator: 'Command+R',
                            click() {
                                mainWindow.webContents.reload();
                            }
                        },
                        {
                            label: 'Toggle Full Screen',
                            accelerator: 'Ctrl+Command+F',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        }]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        label: 'Minimize',
                        accelerator: 'Command+M',
                        selector: 'performMiniaturize:'
                    },
                    {
                        label: 'Close',
                        accelerator: 'Command+W',
                        selector: 'performClose:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Bring All to Front',
                        selector: 'arrangeInFront:'
                    }]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            shell.openExternal('http://explorer.hashup.io');
                        }
                    },
                    {
                        label: 'Report issues',
                        click() {
                            shell.openExternal('https://github.com/desduvauchelle/file-explorer/issues');
                        }
                    },
                    {
                        label: 'Suggest a design',
                        click() {
                            shell.openExternal('https://github.com/desduvauchelle/file-explorer/issues');
                        }
                    }
                ]
            }];
    }
    defaultTemplate(app, mainWindow, customIPC) {
        return [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O'
                    },
                    {
                        label: '&Preferences',
                        accelerator: 'Ctrl+,',
                        click() {
                            customIPC.send('module', {
                                module: 'navigation',
                                action: 'goToPage',
                                data: 'settings'
                            })
                        }
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click() {
                            mainWindow.close();
                        }
                    }
                ]
            },
            {
                label: '&View',
                submenu: (process.env.NODE_ENV === 'development') ?
                    [
                        {
                            label: '&Reload',
                            accelerator: 'Ctrl+R',
                            click() {
                                mainWindow.webContents.reload();
                            }
                        },
                        {
                            label: 'Toggle &Full Screen',
                            accelerator: 'F11',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        },
                        {
                            label: 'Toggle &Developer Tools',
                            accelerator: 'Alt+Ctrl+I',
                            click() {
                                mainWindow.toggleDevTools();
                            }
                        }] :
                    [
                        {
                            label: '&Reload',
                            accelerator: 'Ctrl+R',
                            click() {
                                mainWindow.webContents.reload();
                            }
                        },
                        {
                            label: 'Toggle &Full Screen',
                            accelerator: 'F11',
                            click() {
                                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                            }
                        }]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            shell.openExternal('http://explorer.hashup.io');
                        }
                    },
                    {
                        label: 'Report issues',
                        click() {
                            shell.openExternal('https://github.com/desduvauchelle/file-explorer/issues');
                        }
                    },
                    {
                        label: 'Suggest a design',
                        click() {
                            shell.openExternal('https://github.com/desduvauchelle/file-explorer/issues');
                        }
                    }
                ]
            }]
    }
}