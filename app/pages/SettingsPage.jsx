import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReduxBinder from 'alias-redux/ReduxBinder'
import Select from 'react-select'
import fileSystemTools from 'alias-utils/fileSystemTools'
import Path from 'path'

const themes = [
    {
        label: 'Default',
        value: 'default'
    },
    {
        label: 'Dark',
        value: 'dark'
    }
]

class SettingsPage extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)

        this.state = {
            extension: {
                extension: '',
                appId: ''
            }
        }
    }
    render() {
        const {extension} = this.state;
        const {state, actions} = this.props;
        let {showHidden, theme, extensionsOpenWith, pathsOpenWith, apps} = state.settings;

        extensionsOpenWith = extensionsOpenWith.map(x => {
            x.appName = "Not found"
            let foundApps = apps.filter(app => app.id === x.appId)
            if (foundApps.length > 0) {
                x.appName = foundApps[0].name
            }
            return x
        })

        return (
            <div className="full settings">
                <div className="full-overflow">
                    <div className="container">
                        <div className="header">
                            <a onClick={() => actions.navigation.goToPage('explorer')}><i className="fa fa-arrow-left" /> Back</a>
                            <h2>Settings</h2>
                        </div>
                        <h3>View</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <label>
                                    Themes
                                </label>
                                <Select name="form-field-name"
                                        value={theme}
                                        options={themes}
                                        onChange={(item) => this._onChange('theme', item.value)} />
                            </div>
                            <div className="col-md-6">
                                <label>
                                    <input checked={showHidden}
                                           onChange={this._onChange.bind(this, 'showHidden', !showHidden)}
                                           type="checkbox" /> Show hidden files
                                </label>
                            </div>
                        </div>
                        <br />
                        <br />
                        <h3>Apps</h3>
                        <p className="help-block">
                            <i className="fa fa-info-circle"></i> Add apps which you would like to use
                        </p>
                        <table className="table table-stripped">
                            <thead>
                                <tr>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Path
                                    </th>
                                    <th width={30}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map(app => <tr key={app.id}>
                                                     <td>
                                                         {app.name}
                                                     </td>
                                                     <td>
                                                         {app.path}
                                                     </td>
                                                     <td>
                                                         <a onClick={this._onRemoveApp.bind(this, app.id)}
                                                            className="red"><i className="fa fa-trash"></i></a>
                                                     </td>
                                                 </tr>)}
                                <tr>
                                    <td colSpan={3}>
                                        <input type="file"
                                               accept=".app,.exe"
                                               ref="addApp"
                                               onChange={this._onAppChange.bind(this)}
                                               style={{
                                                          display: 'none'
                                                      }} />
                                        <a onClick={() => this.refs.addApp.click()}
                                           className="btn btn-secondary">+ Add an app</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <br />
                        <h3>Open with</h3>
                        <p className="help-block">
                            <i className="fa fa-info-circle"></i> Automatically set what apps you want to open a file or directory by double clicking. By default we use your OS set.
                        </p>
                        <form onSubmit={this._onSubmitExtension.bind(this)}>
                            <table className="table table-stripped">
                                <thead>
                                    <tr>
                                        <th>
                                            Extensions
                                        </th>
                                        <th>
                                            Application
                                        </th>
                                        <th width={30}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {extensionsOpenWith.map(ext => <tr key={ext.id}>
                                                                       <td>
                                                                           {ext.extension}
                                                                       </td>
                                                                       <td>
                                                                           {ext.appName}
                                                                       </td>
                                                                       <td>
                                                                           <a onClick={this._onRemoveExtension.bind(this, ext.id)}
                                                                              className="red"><i className="fa fa-trash"></i></a>
                                                                       </td>
                                                                   </tr>)}
                                    <tr>
                                        <td>
                                            <input type="text"
                                                   ref="addExtName"
                                                   value={extension.extension}
                                                   onChange={(e) => this.setState({
                                                                 extension: {
                                                                     ...extension,
                                                                     extension: e.target.value
                                                                 }
                                                             })}
                                                   className="form-control"
                                                   placeholder="Ex: .png (One at the time)" />
                                        </td>
                                        <td>
                                            <select className="form-control"
                                                    onChange={(e) => this.setState({
                                                                  extension: {
                                                                      ...extension,
                                                                      appId: e.target.value
                                                                  }
                                                              })}
                                                    value={extension.appId}>
                                                <option value=""
                                                        disabled>
                                                    None
                                                </option>
                                                {apps.map(app => <option key={app.id}
                                                                         value={app.id}>
                                                                     {app.name}
                                                                 </option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-default"
                                                    type="submit">
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                        <br />
                        <br />
                        <table className="table table-stripped">
                            <thead>
                                <tr>
                                    <th>
                                        Paths
                                    </th>
                                    <th>
                                        Application
                                    </th>
                                    <th width={30}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pathsOpenWith.map(p => <tr key={p.id}>
                                                            <td>
                                                                {p.path}
                                                            </td>
                                                            <td>
                                                                {p.app}
                                                            </td>
                                                            <td>
                                                                <a onClick={this._onRemoveApp.bind(this, p.id)}
                                                                   className="red"><i className="fa fa-trash"></i></a>
                                                            </td>
                                                        </tr>)}
                            </tbody>
                        </table>
                        <input type="file"
                               accept=".app,.exe"
                               ref="addPathLink"
                               onChange={this._onAppChange.bind(this)}
                               style={{
                                          display: 'none'
                                      }} />
                        <a onClick={() => this.refs.addPathLink.click()}
                           className="btn btn-secondary">+ Add path link</a>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
            );
    }

    _onChange(attribute, value) {
        let newAttributeValues = {};
        newAttributeValues[attribute] = value;
        this.props.actions.settings.update(newAttributeValues);
    }

    _onAppChange(e) {
        let file = e.target.files[0];
        if (!file) {
            return
        }
        if (['.app', '.exe'].indexOf(Path.extname(file.name)) === -1) {
            alert("Please select an application")
            return
        }
        this.props.actions.settings.appAdd(file.path)
    }
    _onRemoveApp(id) {
        this.props.actions.settings.appRemove(id)
    }

    _onSubmitExtension(e) {
        e.preventDefault()
        let {extension} = this.state;
        if (!extension.appId) {
            alert("Please select and app.")
            return
        }
        if (!extension.extension || extension.extension.length > 5 || extension.extension.length < 1) {
            alert("Extension name doesn't look right")
            return
        }
        if (extension.extension.charAt(0) !== '.') {
            extension.extension = '.' + extension.extension
        }
        this.props.actions.settings.extensionsOpenWithAdd(extension)
        this.setState({
            extension: {
                extension: '',
                appId: ''
            }
        })
    }
    _onRemoveExtension(id) {
        this.props.actions.settings.extensionsOpenWithRemove(id)
    }

    _onRemovePath(id) {
        this.props.actions.settings.pathsOpenWithRemove(id)
    }
}

export default ReduxBinder(SettingsPage, {
    state: ['settings']
})
