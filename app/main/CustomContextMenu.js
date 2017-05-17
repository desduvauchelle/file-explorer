import { shell, clipboard } from 'electron'
import defaultSettings from '../settings.default'
import { spawn } from 'child_process'
import Storage from '../utils/storage'
import path from 'path'

export default class CustomContextMenu {
    constructor(mainWindow, props, e, customIPC) {
        this.menuContent = this._menuContent(mainWindow, props, e, customIPC)
    }
    _menuContent(mainWindow, props, e, customIPC) {
        const {x, y} = props;
        let menuContent = []

        if (props.linkURL) {
            let file = props.linkURL.replace('file://', '')
            let state = new Storage({
                configName: 'settings',
                defaults: defaultSettings
            }).get('state')

            //
            //
            //
            menuContent.push({
                label: 'Copy path',
                click() {
                    clipboard.writeText(file)
                }
            })
            menuContent.push({
                label: 'Rename',
                click() {
                    alert('Not done yet')
                }
            })
            menuContent.push({
                label: 'Move to trash',
                click() {
                    customIPC.send('module', {
                        module: 'fileExplorer',
                        action: 'remove',
                        data: file
                    })
                }
            })
            menuContent.push({
                type: 'separator'
            })
            //
            //
            //
            menuContent.push({
                label: 'Add to favorites',
                click() {
                    customIPC.send('module', {
                        module: 'favorites',
                        action: 'linkAdd',
                        data: {
                            favoriteId: 'default',
                            file: file
                        }
                    })
                }
            })
            let addTo = []
            if (state && state.favorites) {
                state.favorites.map(fav => {
                    addTo.push({
                        label: fav.name,
                        click() {
                            customIPC.send('module', {
                                module: 'favorites',
                                action: 'linkAdd',
                                data: {
                                    favoriteId: fav.id,
                                    file: file
                                }
                            })
                        }
                    })
                })
            }
            menuContent.push({
                label: 'Add to',
                submenu: addTo
            })
            //
            //
            //
            menuContent.push({
                type: 'separator'
            })
            menuContent.push({
                label: 'Open',
                click() {
                    shell.openItem(file)
                }
            })
            let openWith = []

            if (state && state.settings && state.settings.apps) {
                state.settings.apps.map(app => {
                    openWith.push({
                        label: app.name,
                        click() {
                            spawn(app.path, [file])
                        }
                    })
                })
            }
            menuContent.push({
                label: 'Open with',
                submenu: openWith
            })
        }
        if (process.env.NODE_ENV === 'development') {
            menuContent.push({
                type: 'separator'
            })
            menuContent.push({
                label: 'Inspect element',
                click() {
                    mainWindow.inspectElement(x, y);
                }
            })
            menuContent.push({
                label: 'Log content',
                click() {
                    console.log('=================================')
                    console.log(e)
                    console.log('=================================')
                    console.log(props);
                    console.log('=================================')
                    console.log('=================================')
                }
            })
        }
        return menuContent
    }
}