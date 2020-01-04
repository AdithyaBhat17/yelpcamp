import React, { useState, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { useToasts } from 'react-toast-notifications';

import { TParams } from './CampgroundPage';

interface Comments extends RouteComponentProps<TParams> {
  comments: Array<Comment>;
  campgroundName: string;
}

interface Comment {
  _id: string;
  text: string;
  author: string;
}

const Comments: React.FunctionComponent<Comments> = ({
  comments,
  campgroundName,
  match,
  history
}) => {
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<{ comment: boolean; button: boolean }>(
    { comment: false, button: false }
  );
  let [_comments, setComments] = useState<Array<Comment>>(comments);

  const { addToast } = useToasts();

  const handleComment = (event: FormEvent) => {
    event.preventDefault();

    if (comment.trim().length === 0) {
      setError('Comment cannot be empty :/');
      return;
    } else {
      setLoading({ ...loading, comment: true });
      fetch(`${process.env.REACT_APP_BASE_URL}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment,
          campgroundId: match.params.id
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw res;
          }
        })
        .then(data => {
          setLoading({ ...loading, comment: false });
          setComment('');
          _comments.unshift(data.comment);
          setComments([..._comments]);
        })
        .catch(error => {
          error.json().then((data: any) => {
            addToast(data.message, { appearance: 'error', autoDismiss: true });
            if (error.status === 401) {
              history.push({
                pathname: '/login',
                state: { from: `/${match.params.id}` }
              });
            }
          });
        });
    }
  };

  const deleteComment = (id: string) => {
    setLoading({ ...loading, button: true });
    fetch(`${process.env.REACT_APP_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then(data => {
        setLoading({ ...loading, button: false });
        addToast(data.message, { appearance: 'success', autoDismiss: true });
        _comments = _comments.filter(comment => comment._id !== id && comment);
        setComments([..._comments]);
      })
      .catch(error => {
        error.json().then((data: any) => {
          addToast(data.message, { appearance: 'error', autoDismiss: true });
          if (error.status === 401) {
            history.push({
              pathname: '/login',
              state: { from: `/${match.params.id}` }
            });
          }
        });
      });
  };

  return (
    <React.Fragment>
      <h4>Comments</h4>
      <form className='comment-form' onSubmit={handleComment}>
        <div className='form-group'>
          <textarea
            name='comment'
            id='comment'
            value={comment}
            onFocus={() => setError('')}
            onChange={event =>
              comment.length <= 150
                ? setComment(event.target.value)
                : setError('Comment length exceeded :/')
            }
            className={`form-control comment-box ${
              comment.length > 150 ? 'error-input' : ''
            }`}
            placeholder={`What do you think about ${campgroundName}?`}
          />
          {error ? <small className='error-text'>{error}</small> : null}
          <input
            type='submit'
            value={loading.comment ? '...' : 'Comment'}
            className='comment-btn'
          />
        </div>
      </form>
      <div className='comments'>
        {_comments.map((comment: Comment) => (
          <div key={comment._id} className='comment'>
            <div className='comment-text'>
              <p>{comment.text}</p>
              <small>{comment.author}</small>
            </div>
            {comment.author === sessionStorage.getItem('hello') && (
              <div className='delete-button'>
                <button
                  className='delete-btn'
                  disabled={loading.button}
                  onClick={() => deleteComment(comment._id)}
                >
                  <i className='fa fa-trash'></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Comments;
