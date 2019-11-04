import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import login from '../../assets/login.png';
import { Link } from 'react-router-dom';

interface Props extends RouteComponentProps {
    purpose: string;
}
// @todo create username context 
const Auth: React.FC<Props> = ({purpose, history, location}) => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleAuth = (event: any) => {
        event.preventDefault()
        if(!username.trim().length || !password.trim().length) {
            setError('Username / Password is empty :(')
            return
        }
        fetch(`http://localhost:8080/${purpose}/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
        .then(res => res.json())
        .then(data => {
            if(data && data.success) {
                sessionStorage.setItem('hello', data.username)
                history.push(`${location.state ? location.state.from : '/'}`)
                setError('')
            } else
                setError(data.err.message)
        })
        .catch(_error => setError("User doesn't exist"))
    }

    return (
        <div className="container login">
            <div className="row">
                <div className="col-lg-6 col-sm-12">
                    <div>
                        <h1 className="auth-h1">Identify yourself <br/> Human!</h1>
                        <form className="auth-form" onSubmit={handleAuth}>
                            <input type="hidden" value="something" />
                            <div className="form-group">
                                <label htmlFor="username">Username</label>                        
                                <input
                                    type="text"
                                    name="username" 
                                    autoComplete="new-password"
                                    className="form-control" 
                                    placeholder="John Doe" 
                                    onChange={(event) => setUsername(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>                        
                                <input
                                    type="password"
                                    name="password" 
                                    autoComplete="new-password"
                                    className="form-control" 
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            {error ? <small>{error}</small> : <br/>}
                            <input type="submit" value={purpose === 'login' ? 'Login' : 'Sign Up'} className="auth-btn"/>
                            <Link to={{
                                pathname: purpose === 'login' ? '/signup' : '/login', 
                                state: {from: location.state ? location.state.from : '/'}}}
                            >
                                {purpose === 'login' ? <small>New here? sign up</small> :
                                <small>Been here before? Login</small>}
                            </Link>
                        </form>
                    </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                    <img src={login} className="login-image" alt="login illustration"/>
                </div>
            </div>
        </div>
    )
}

export default Auth