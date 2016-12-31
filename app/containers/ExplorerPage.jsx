import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import View from '../components/View'
import * as FavoritesActions from '../actions/favorites'

export default connect(
    state => ({
        state: state
    }),
    (dispatch) => {
        return {
            actions: {
                favorite: bindActionCreators(FavoritesActions, dispatch)
            }
        }
    }
)(View);
