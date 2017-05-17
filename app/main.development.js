import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import Storage from './utils/storage'
import CustomMenu from './main/CustomMenu'
import CustomContextMenu from './main/CustomContextMenu'
import CustomIPC from './main/CustomIPC'

let menu;
let template;
let mainWindow = null;
//
// INIT LOCAL STORAGE
//
import defaultSettings from './settings.default'
const settings = new Storage(
    {
        configName: 'settings',
        defaults: defaultSettings
    });
//
//
//
const customIPC = new CustomIPC()
ipcMain.on('window-init', (event, arg) => {
    customIPC.setEvent(event)
})
//
//
//
if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support'); // eslint-disable-line
    sourceMapSupport.install();
}
if (process.env.NODE_ENV === 'development') {
    require('electron-debug')(); // eslint-disable-line global-require
    const path = require('path'); // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
    require('module').globalPaths.push(p); // eslint-disable-line
}

//
//
//
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const installExtensions = async() => {
    if (process.env.NODE_ENV === 'development') {
        const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

        const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        for (const name of extensions) { // eslint-disable-line
            try {
                await installer.default(installer[name], forceDownload);
            } catch (e) {} // eslint-disable-line
        }
    }
};

app.on('ready', async() => {
    await installExtensions();
    let windowView = settings.get('view');
    mainWindow = new BrowserWindow(
        {
            show: false,
            center: true,
            width: windowView.size.width,
            height: windowView.size.height,
            minWidth: 600,
            minHeight: 600,
            titleBarStyle: 'hidden'
        });

    mainWindow.on('resize', () => {
        // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
        // the height, width, and x and y coordinates.
        let {width, height} = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        settings.set('view', Object.assign(
            {}, windowView,
            {
                size: {
                    width: width,
                    height: height
                }
            }));
    });

    mainWindow.loadURL(`file://${ __dirname }/app.html`);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }
    mainWindow.webContents.on('context-menu', (e, props) => {
        const {x, y} = props;
        const customContextMenu = new CustomContextMenu(mainWindow, props, e, customIPC)
        let menuContent = customContextMenu.menuContent
        Menu.buildFromTemplate(menuContent).popup(mainWindow);
    });

    const customMenu = new CustomMenu(app, process.env.NODE_ENV, mainWindow, customIPC)
    template = customMenu.template
    menu = Menu.buildFromTemplate(template)
    if (process.platform === 'darwin') {
        Menu.setApplicationMenu(menu);
    } else {
        mainWindow.setMenu(menu);
    }
});
