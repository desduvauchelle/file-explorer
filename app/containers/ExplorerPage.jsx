import { connect } from 'react-redux';
import View from '../components/View';
import * as FavoritesActions from '../actions/favorites';

export default connect(
    state => ({ favorites: state.favorites }),
    { ...FavoritesActions }
)(View);
