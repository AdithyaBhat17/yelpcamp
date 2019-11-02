import React, { useState, FormEvent, useEffect } from 'react'
import { RouteComponentProps, Redirect } from 'react-router'
import { TParams } from './CampgroundPage'

interface Comments extends RouteComponentProps<TParams>{
    comments: Array<Comment>,
    campgroundName: string;
}

interface Comment {
    _id: string;
    text: string;
    author: string;
}

const Comments: React.FunctionComponent<Comments> = ({comments, campgroundName, match, history}) => {

    const [comment, setComment] = useState<string>('')
    const [error, setError] = useState<string>('')

    const doesCommentLengthExceed = (): boolean => {
        return comment.length > 150
    }

    const handleComment = (event: FormEvent) => {
        event.preventDefault()
        let author: string | null = sessionStorage.getItem('hello')

        if(comment.trim().length === 0) {
            setError('Comment cannot be empty :/')
            return
        } else if (!author) {
            history.push({pathname: '/login', state: {from: `/${match.params.id}`}})
        } else {
            fetch(`http://localhost:8080/campgrounds/${match.params.id}/comments`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data && data.comment) {
                    comments.unshift(data.comment)
                } else if(data && data.isLoggedIn === false) {
                    history.push({pathname: '/login', state: {from: `/${match.params.id}`}})
                } else if(data && !data.success) {
                    setError(data.message)
                }
            })
        }
    }

    return (
        <React.Fragment>
            <h4>Comments</h4>
            <form className="comment-form" onSubmit={handleComment}>
                <div className="form-group">
                    <textarea
                     name="comment" 
                     id="comment" 
                     onChange={(event) => setComment(event.target.value)}
                     className={`form-control comment-box ${comment.length > 150 ? 'error-input' : ''}`} 
                     placeholder={`What do you think about ${campgroundName}?`}
                    />
                    {doesCommentLengthExceed() ? 
                    <small className="error-text">Comment length exceeded :/</small> : 
                    null}
                    <input type="submit" value='Comment' className="comment-btn"/>
                </div>
            </form>
            <div className="comments">
                {comments.map((comment: Comment) => (
                    <div key={comment._id} className="comment">
                        <div className="comment-text">
                            <span>{comment.text}</span> <br/>
                            <small>{comment.author}</small>
                        </div>
                        {comment.author === sessionStorage.getItem('hello') && <div className="delete-button">
                            <button>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>}
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}

export default Comments