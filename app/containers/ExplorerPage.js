import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import View from '../components/View';
import * as FavoritesActions from '../actions/favorites';

function mapStateToProps( state ) {
    return { favorites: state.favorites };
}

function mapDispatchToProps( dispatch ) {
    return bindActionCreators( FavoritesActions, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( View );
