import React, { useState } from 'react';
import moment from 'moment';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [DOB, setDOB] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // Format the date in MM/DD/YYYY format
        const formattedDOB = moment(DOB).format('MM/DD/YYYY');

        const login = await fetch('http://localhost:3030/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, dob: formattedDOB }), // send formatted DOB
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Login successful') {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('email', email);
                    localStorage.setItem('DOB', formattedDOB);
                    localStorage.setItem('regId', data.user.regId);
                    window.location.href = '/security';
                } else {
                    alert(data.message); // Changed to alert the server message
                }
            })
            .catch((err) => {
                console.error('Error:', err);
            });

        if (login) {
            console.log('Login:', login);
        }
    };

    if(localStorage.getItem("user")){
        window.location.href = "/security";
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        id="email"
                        type="email" // Changed to type="email" for validation
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="dob" className="block text-gray-700 mb-2">DOB</label>
                    <input
                        id="dob"
                        type="date"
                        value={DOB}
                        onChange={(e) => setDOB(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
