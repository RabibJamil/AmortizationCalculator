import React from 'react';
import { HashRouter as Router } from 'react-router-dom'; // Import HashRouter
import AmortizationCalculator from './AmortizationCalculator';
import './App.css';

const App = () => {
    return (
      <Router> {/* Wrap your app in HashRouter */}
        <div className="App">
            <AmortizationCalculator />
        </div>
    </Router>
    );
};

export default App;
