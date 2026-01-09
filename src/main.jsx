// FILE: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter/*  basename="/react-vite-tailwind-ecommerce" */>
    <App />
  </HashRouter>
);
