import React, { useState, useReducer, FormEvent } from 'react'
import { RouteComponentProps, Redirect } from 'react-router'
import { useFetch } from '../hooks/useFetch'

const initialState = {
    name: '',
    description: '',
    file: '',
    price: ''
}

const inputReducer = (state = initialState, action: { type: string, field: any }) => {
    switch(action.type) {
        case 'input': 
            return {
                ...state,
                [action.field.name]: action.field.value
            }
        case 'file':   
            return {
                ...state,
                file: action.field
            }
        default: 
            return state
    } 
}

const AddCampground = ({history}: RouteComponentProps) => {

    let [data, loading] = useFetch('http://localhost:8080/authorized/')
    const [error, setError] = useState<string>('')
    const [state, dispatch] = useReducer(inputReducer, initialState)
    const [submit, setSubmit] = useState<boolean>(false)

    const toBase64 = (file: Blob) => {
        if(file === null)
            return
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => dispatch({type: 'file', field: reader.result})
        reader.onerror = error => console.log(error)
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        let { name, file, description, price } = state
        if(!name.length || !file || !description.length || !price.length) {
            setError('Please fill all the fields!')
            return
        }
        setSubmit(true)
        fetch(`http://localhost:8080/campgrounds/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, file, description, price})
        })
        .then(res => res.json())
        .then(data => {
            if(data && data.success) {
                history.push('/')
            } else {
                setSubmit(false)
                setError(data.message)
            }
        })
        .catch(() => {
            setSubmit(false)
            setError('Something went wrong :( Try again!')
        })
    }

    if(loading && !data) 
        return <div>loading...</div>

    if(data && data.isLoggedIn === false)
        return <Redirect to={{pathname: '/login', state: {from: '/add'}}} />

    return (
        <div className="campground-form">
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name of the campground</label>
                    <input 
                     className="form-control campground-input" 
                     type="text" 
                     name="name" 
                     onFocus={() => error.length && setError('')}
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     placeholder="Yosemite"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Describe {state.name || 'Campground'}</label>
                    <textarea 
                     className="form-control campground-input" 
                     name="description" 
                     onFocus={() => error.length && setError('')}
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     placeholder="Yosemite"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Campground image</label>
                    <input 
                     className="form-control campground-input" 
                     type="file" 
                     name="file" 
                     onFocus={() => error.length && setError('')}
                     onChange={(e) => e.target.files !== null && toBase64(e.target.files[0])}
                    //  placeholder="https://domain.com/image.jpg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input 
                     type="number" className="form-control campground-input"
                     name="price" 
                     onFocus={() => error.length && setError('')}
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     min="1"
                     max="10000"
                    />
                </div>
                {error ? <small className="error-text">{error}</small> : null}
                <input className="auth-btn" type="submit" value={`${submit ? 'Adding' : 'Add'} Campground`}/>
            </form>
        </div>
    )
}

export default AddCampground