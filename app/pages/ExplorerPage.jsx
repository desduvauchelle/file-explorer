import ReduxBinder from '../redux/ReduxBinder'

import View from './explorer/View'

export default ReduxBinder(View, {
    state: ['favorites']
})
