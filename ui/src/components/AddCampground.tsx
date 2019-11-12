import React, { useState, useReducer, FormEvent } from 'react'
import { RouteComponentProps, Redirect } from 'react-router'
import { useFetch } from '../hooks/useFetch'
import tourist from '../assets/tourist.png'
import { IntersectingCirclesSpinner } from 'react-epic-spinners'

const initialState = {
    name: '',
    description: '',
    file: '',
    price: ''
}

const inputReducer = (state = initialState, action: { type: string, field: any }) => {
    switch(action.type) {
        case 'input': // input field
            return {
                ...state,
                [action.field.name]: action.field.value
            }
        case 'file': // file upload
            return {
                ...state,
                file: action.field
            }
        default: 
            return state
    } 
}

const AddCampground = ({history}: RouteComponentProps) => {

    let [data, loading] = useFetch(`${process.env.REACT_APP_BASE_URL}/authorized/`)
    const [error, setError] = useState<string>('')
    const [state, dispatch] = useReducer(inputReducer, initialState)
    const [submit, setSubmit] = useState<boolean>(false)

    // convert image to base64 format before uploading to cloudinary
    const toBase64 = (file: Blob) => {
        if(file === null)
            return
        const reader = new FileReader()
        reader.readAsDataURL(file)
        // dispatch action once the file is loaded to add file to the state
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
        setSubmit(true) // show loading ... on the submit button
        fetch(`${process.env.REACT_APP_BASE_URL}/campgrounds/`, {
            method: 'POST',
            credentials: 'include',
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

    // show spinner until the data is fetched
    if(loading && !data) 
        return <IntersectingCirclesSpinner className="loading loading-2" color="#feca74" />

    // redirect to login page if unauthorized
    if(data && data.isLoggedIn === false)
        return <Redirect to={{pathname: '/login', state: {from: '/add'}}} />

    return (
        <div className="container">
            <div className="row camp">
                <div className="col-lg-6 col-sm-12">
                    <h1 className="auth-h1 camp-h1">Add new campground</h1>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="campground-label" htmlFor="name">Name of the campground</label>
                            <input 
                            className="form-control campground-input" 
                            type="text" 
                            name="name" 
                            // clear error message when an input field is focused
                            onFocus={() => error.length && setError('')}
                            // dispatch action when the field changes.
                            onChange={(e) => dispatch({type: 'input', field: e.target})}
                            placeholder="Yosemite"
                            />
                        </div>
                        <div className="form-group">
                            <label className="campground-label" htmlFor="description">Describe {state.name || 'Campground'}</label>
                            <textarea 
                            className="form-control campground-input" 
                            name="description" 
                            onFocus={() => error.length && setError('')}
                            onChange={(e) => dispatch({type: 'input', field: e.target})}
                            placeholder="Yosemite"
                            />
                        </div>
                        <div className="form-group">
                            <label className="campground-label" htmlFor="image">Campground image</label>
                            <input 
                            className="form-control campground-input" 
                            type="file" 
                            name="file" 
                            onFocus={() => error.length && setError('')}
                            onChange={(e) => e.target.files !== null && toBase64(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group">
                            <label className="campground-label" htmlFor="price">Price</label>
                            <input 
                            type="number" className="form-control campground-input"
                            name="price" 
                            onFocus={() => error.length && setError('')}
                            onChange={(e) => dispatch({type: 'input', field: e.target})}
                            min="1"
                            max="10000"
                            />
                        </div>
                        {error ? <small className="error-text">{error}</small> : <br />}
                        <input className="auth-btn camp-btn" type="submit" value={`${submit ? 'Adding' : 'Add'} Campground`}/>
                    </form>
                </div>
                <div className="col-lg-6 col-sm-12">
                    <img src={tourist} alt="tourist" className="tourist-img"/>
                </div>
            </div>
        </div>
    )
}

export default AddCampground