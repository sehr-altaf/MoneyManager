import react from "react";
import App from "./App";
import ReactDom from 'react-router-client';
import './index.css'


ReactDom.createRoot (document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)