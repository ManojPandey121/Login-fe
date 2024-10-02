import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const navigate = useNavigate();

    // Function to validate the password requirements
    const validatePassword = (value) => {
        const requirements = [];
        if (value.length < 8) {
            requirements.push('at least 8 characters');
        }
        if (!/[A-Z]/.test(value)) {
            requirements.push('one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
            requirements.push('one lowercase letter');
        }
        if (!/[0-9]/.test(value)) {
            requirements.push('one number');
        }
        if (!/[!@#$%^&*]/.test(value)) {
            requirements.push('one special character (!@#$%^&*)');
        }

        if (requirements.length > 0) {
            setPasswordError(`Password must contain ${requirements.join(', ')}`);
        } else {
            setPasswordError('');
        }
    };

    // Function to handle password change
    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        validatePassword(value);
    };

    // Function to check if passwords match
    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        setConfirmPassword(value);
        setPasswordsMatch(value === password);
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Submit registration data
        // make form submission
        const res = await fetch('http://localhost:3200/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'content-type': 'application/json',
            },
        });
        const data = await res.json();
        if (data.success) {
            navigate('/dashboard');
            alert(data.message || 'User creation successful!');
        } else {
            alert('User creation failed!');
        }
    };

    return (
        <div>
            <h1>Register User</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                {passwordError && (
                    <p style={{ color: 'red', fontSize: '0.9em' }}>{passwordError}</p>
                )}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                />
                {!passwordsMatch && confirmPassword && (
                    <p style={{ color: 'red', fontSize: '0.9em' }}>
                        Passwords do not match
                    </p>
                )}
                <button type="submit" disabled={passwordError !== '' || !passwordsMatch}>
                    Register
                </button>
            </form>
            <p className='footer'>
                Already have an account?{' '}
                <Link to="/login">
                    Login here
                </Link>
            </p>
        </div>
    );
}

export default Register;
