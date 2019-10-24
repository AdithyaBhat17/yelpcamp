import React, { useState } from 'react'

interface Comments {
    comments: Array<Comment>,
    campgroundName: string;
}

interface Comment {
    _id: string;
    text: string;
    author: string;
}

const Comments: React.FC<Comments> = ({comments, campgroundName}) => {

    let [remainingCommentLength, setRemainingCommentLength] = useState<number>(0)

    const handleCommentLength = (comment: string) => {
        setRemainingCommentLength(comment.length)
    }

    const doesCommentLengthExceed = () => {
        return remainingCommentLength > 150
    }

    return (
        <div>
            <h4>Comments</h4>
            <form className="comment-form">
                <div className="form-group">
                    <textarea
                     name="comment" 
                     id="comment" 
                     onChange={(event) => handleCommentLength(event.target.value)}
                     className={`form-control comment-box ${remainingCommentLength > 150 ? 'error-input' : ''}`} 
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
                        <div className="delete-button">
                            <button>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments