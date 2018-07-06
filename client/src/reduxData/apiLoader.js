import {
  FETCH_MOVIES_BEGIN,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
  FETCH_COMM_BEGIN,
  FETCH_COMM_SUCCESS,
  FETCH_COMM_FAILURE,
  FETCH_UPDATE_MOVIES_SUCCESS,
  FETCH_UPDATE_COMMS_SUCCESS
} from './fetchAPI';

const initialState = {
  items: [],
  loading: false,
  error: null
};

export function moviesLoader(state = initialState, action) {
  switch (action.type) {
    case FETCH_MOVIES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_MOVIES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.movies
      };
    case FETCH_UPDATE_MOVIES_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case FETCH_MOVIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };
    default:
      return state;
  }
}

export function commentsLoader(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMM_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_COMM_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.comments
      };
    case FETCH_UPDATE_COMMS_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case FETCH_COMM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };
    default:
      return state;
  }
}
