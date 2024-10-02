import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const recaptcha = useRef();
    const [username, setuserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [captchaValid, setCaptchaValid] = useState(true);
    const navigate = useNavigate();

     // This effect can be used to check if the user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log(10, isAuthenticated)
    if (isAuthenticated) {
      // If not authenticated, redirect to login page
      navigate('/dashboard');
    }
  }, [navigate]);

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

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        validatePassword(value);
    };

    const handleCaptchaChange = () => {
        setCaptchaValid(true);
    };

    async function submitForm(event) {
        event.preventDefault();
        const captchaValue = recaptcha.current.getValue();
        if (!captchaValue) {
            setCaptchaValid(false);
            alert('Please verify the reCAPTCHA!');
        } else {
            setCaptchaValid(true);
            // make form submission
            const res = await fetch('http://localhost:3200/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password, captchaValue }),
                headers: {
                    'content-type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('isAuthenticated', true);
                navigate('/dashboard');
            } else {
                localStorage.setItem('isAuthenticated', false);
                alert('reCAPTCHA validation failed!');
            }
        }
    }

    return (
        <div>
            <h1>User Login</h1>
            <form onSubmit={submitForm}>
                <input
                    name="username"
                    type="text"
                    value={username}
                    required
                    placeholder="User name"
                    onChange={(event) => setuserName(event.target.value)}
                />
                <input
                    name="Password"
                    type="password"
                    value={password}
                    required
                    placeholder="Password"
                    onChange={handlePasswordChange}
                />
                {passwordError && (
                    <p style={{ color: 'red', fontSize: '0.9em' }}>{passwordError}</p>
                )}
                <div
                    style={{
                        border: !captchaValid ? '2px solid red' : 'none',
                        borderRadius: '5px',
                    }}
                >
                    <ReCAPTCHA
                        ref={recaptcha}
                        sitekey={process.env.REACT_APP_SITE_KEY}
                        onChange={handleCaptchaChange}
                    />
                </div>
                <button type="submit" disabled={passwordError !== ''}>
                    Login
                </button>
            </form>
            <p className='footer'>
                Don't have an account?{' '}
                <Link to="/register">
                    Register here
                </Link>
            </p>
        </div>
    );
}

export default Login;
