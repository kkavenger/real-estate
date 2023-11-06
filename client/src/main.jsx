import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

//Covering the application with the PersistGate
//Covering the application with Provider to make store with Redux
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading = {null} persistor = {persistor}>
      <App />
    </PersistGate>
  </Provider>,
)
