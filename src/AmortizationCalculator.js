import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AmortizationCalculator = () => {
    const [currentBalance, setCurrentBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [termYears, setTermYears] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [extraPrincipal, setExtraPrincipal] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [calculatedPayment, setCalculatedPayment] = useState('');

    // Function to calculate the monthly mortgage payment
    const calculateMonthlyPayment = () => {
        const P = parseFloat(currentBalance);
        const r = parseFloat(interestRate) / 100 / 12;
        const n = parseInt(termYears) * 12;

        if (P && r && n) {
            const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            setCalculatedPayment(M.toFixed(2));
            setMonthlyPayment(M.toFixed(2)); // Pre-fill the monthly payment input
        } else {
            setCalculatedPayment('');
            setMonthlyPayment('');
        }
    };

    useEffect(() => {
        calculateMonthlyPayment();
    }, [currentBalance, interestRate, termYears]);

    
    const tableRef = useRef(null); // Create a ref for the table

    const calculateAmortization = (e) => {
        e.preventDefault();
        const balance = parseFloat(currentBalance);
        const rate = parseFloat(interestRate) / 100 / 12;
        const term = parseInt(termYears) * 12;
        const extraPayment = parseFloat(extraPrincipal) || 0;

        // Use the user-defined monthly payment if it's provided; otherwise use the calculated one
        const totalMonthlyPayment = monthlyPayment ? parseFloat(monthlyPayment) + extraPayment : parseFloat(calculatedPayment) + extraPayment;

        if (isNaN(balance) || isNaN(rate) || isNaN(term) || rate === 0 || isNaN(totalMonthlyPayment)) {
            alert('Please enter valid numbers.');
            return;
        }

        const amortizationSchedule = [];
        let remainingBalance = balance;

        for (let i = 0; i < term; i++) {
            const interestPayment = remainingBalance * rate;
            const principalPayment = totalMonthlyPayment - interestPayment;

            if (remainingBalance > 0) {
                amortizationSchedule.push({
                    month: (i % 12) + 1,
                    year: Math.floor(i / 12) + 1,
                    interestPayment: interestPayment.toFixed(2),
                    principalPayment: principalPayment > 0 ? principalPayment.toFixed(2) : 0,
                    remainingBalance: remainingBalance > 0 ? (remainingBalance - principalPayment).toFixed(2) : 0,
                });
            }

            remainingBalance -= principalPayment;

            if (remainingBalance <= 0) {
                break;
            }
        }

        setSchedule(amortizationSchedule);

        // Scroll to the table after a short delay
        setTimeout(() => {
            if (tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                tableRef.current.focus(); // Set focus on the table
            }
        }, 100); // Slight delay to ensure the schedule has rendered
    };

    return (
        <div>
            <h1>Amortization Calculator</h1>
            <form onSubmit={calculateAmortization}>
                <div>
                    <label>
                        Current Home Balance ($):
                        <input
                            type="number"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Annual Interest Rate (%):
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Term (Years):
                        <input
                            type="number"
                            value={termYears}
                            onChange={(e) => setTermYears(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Monthly Mortgage Payment ($):
                        <input
                            type="number"
                            value={monthlyPayment}
                            onChange={(e) => setMonthlyPayment(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Extra Principal Payment ($):
                        <input
                            type="number"
                            value={extraPrincipal}
                            onChange={(e) => setExtraPrincipal(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Calculate</button>
            </form>

            {schedule.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    tabIndex={-1} // Makes the div focusable
                    ref={tableRef} // Attach the ref
                >
                    <h2>Amortization Schedule</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Month</th>
                                <th>Interest Payment</th>
                                <th>Principal Payment</th>
                                <th>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((item, index) => (
                                <tr key={`${item.year}-${item.month}-${index}`}>
                                    <td>{item.year}</td>
                                    <td>{item.month}</td>
                                    <td>${item.interestPayment}</td>
                                    <td>${item.principalPayment}</td>
                                    <td>${item.remainingBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
};

export default AmortizationCalculator;
