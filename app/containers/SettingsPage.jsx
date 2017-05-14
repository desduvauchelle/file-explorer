import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import * as ViewActions from '../actions/view'
import Select from 'react-select'
import Helmet from 'react-helmet'

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
    render() {
        const {state} = this.props;
        const {showHidden, theme} = state.view;

        return (
            <div className="full settings">
                <Helmet title="Settings" />
                <div className="full-overflow">
                    <div className="container">
                        <div className="header">
                            <Link to="/">
                            <i className="fa fa-arrow-left" /> Back
                            </Link>
                            <h2>Settings</h2>
                        </div>
                        <h3>View</h3>
                        <label>
                            <input checked={showHidden}
                                   onChange={this._onChange.bind(this, 'showHidden', !showHidden)}
                                   type="checkbox" /> Show hidden files
                        </label>
                        <br />
                        <label>
                            Themes
                        </label>
                        <Select name="form-field-name"
                                value={theme}
                                options={themes}
                                onChange={(item) => {
                                              this._onChange('theme', item.value)
                                          }} />
                    </div>
                </div>
            </div>
            );
    }

    _onChange = (attribute, value) => {

        let newAttributeValues = {};
        newAttributeValues[attribute] = value;
        this.props.actions.view.update(newAttributeValues);
    }
}

export default connect(
    state => ({
        state: state
    }), (dispatch) => {
        return {
            actions: {
                view: bindActionCreators(ViewActions, dispatch)
            }
        }
    }
)(SettingsPage);