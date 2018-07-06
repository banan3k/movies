export const FETCH_MOVIES_BEGIN   = 'FETCH_MOVIES_BEGIN';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';

export const FETCH_UPDATE_MOVIES_SUCCESS = 'FETCH_UPDATE_MOVIES_SUCCESS';

export const fetchMoviesBegin = () => ({
  type: FETCH_MOVIES_BEGIN
});

export const fetchMoviesSuccess = movies => ({
  type: FETCH_MOVIES_SUCCESS,
  payload: { movies }
});

export const fetchUploadMoviesSuccess = () => ({
  type: FETCH_UPDATE_MOVIES_SUCCESS
});

export const fetchMoviesError = error => ({
  type: FETCH_MOVIES_FAILURE,
  payload: { error }
});



export const FETCH_COMM_BEGIN   = 'FETCH_COMM_BEGIN';
export const FETCH_COMM_SUCCESS = 'FETCH_COMM_SUCCESS';
export const FETCH_COMM_FAILURE = 'FETCH_COMM_FAILURE';
export const FETCH_UPDATE_COMMS_SUCCESS = 'FETCH_UPDATE_COMMS_SUCCESS';

export const fetchCommBegin = () => ({
  type: FETCH_COMM_BEGIN
});

export const fetchCommSuccess = comments => ({
  type: FETCH_COMM_SUCCESS,
  payload: { comments }
});

export const fetchCommError = error => ({
  type: FETCH_COMM_FAILURE,
  payload: { error }
});

export const fetchUploadCommsSuccess = () => ({
  type: FETCH_UPDATE_COMMS_SUCCESS
});


export function callApiMovies() {
  return dispatch => {
    dispatch(fetchMoviesBegin());
    return fetch('/api/allMovies')
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchMoviesSuccess(json));
        return json;
      })
      .catch(error => dispatch(fetchMoviesError(error)));
  };
}

export function callApiComments() {
  return dispatch => {
    dispatch(fetchCommBegin());
    return fetch('/api/allComments')
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchCommSuccess(json));
        return json;
      })
      .catch(error => dispatch(fetchCommError(error)));
  };
}

export function callApiCommentsMovie(movieToShow) {
  return dispatch => {
    dispatch(fetchCommBegin());
    return fetch('/api/movieComments?' + movieToShow)
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchCommSuccess(json));
        return json;
      })
      .catch(error => dispatch(fetchCommError(error)));
  };
}




export function addInternalMovie(movieToAdd) {
  return dispatch => {
    dispatch(fetchMoviesBegin());
    return fetch('/api/addMovie?' + movieToAdd, {method: 'post'}).then(dispatch(fetchUploadMoviesSuccess())).catch(error => dispatch(fetchMoviesError(error)));
  };
}

export function addComment(commentToAdd) {
  return dispatch => {
    dispatch(fetchCommBegin());
    return fetch('/api/addComment?' + commentToAdd, {method: 'post'}).then(dispatch(fetchUploadCommsSuccess())).catch(error => dispatch(fetchCommError(error)));
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
