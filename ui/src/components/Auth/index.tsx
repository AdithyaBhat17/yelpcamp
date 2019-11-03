import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'

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
                setError('Something went wrong :(')
        })
        .catch(_error => setError("User doesn't exist"))
    }

    return (
        <div className="login">
            <form className="auth-form" onSubmit={handleAuth}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>                        
                    <input
                     type="text"
                     name="username" 
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
                     className="form-control" 
                     onChange={(event) => setPassword(event.target.value)}
                     required
                    />
                </div>
                <input type="submit" value={purpose === 'login' ? 'Login' : 'Sign Up'} className="auth-btn"/>
            </form>
        </div>
    )
}

export default Auth