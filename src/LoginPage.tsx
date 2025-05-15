import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ici, on tente un login avec username/password, qui seront encodés et stockés dans le contexte
        if (username && password) {
            login(username, password);
            navigate(from, { replace: true });
        } else {
            alert('Enter credentials');
        }
    };

    return (
        <div style={{ maxWidth: 320, margin: '100px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: 4 }}>Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: 4 }}>Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;