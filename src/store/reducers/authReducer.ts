import { AuthAction, AuthState, SET_USER, SET_LOADING, SIGN_OUT, SET_ERROR, NEED_VERIFICATION, SET_SUCCESS } from '../types';

// Mock authenticated state for demo purposes
const initialState: AuthState = {
  user: {
    id: 'mock-user-123',
    firstName: 'Demo User',
    email: 'demo@example.com',
    createdAt: new Date().toISOString()
  },
  authenticated: true,
  loading: false,
  error: '',
  needVerification: false,
  success: ''
}

export default (state = initialState, action: AuthAction) => {
  switch(action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        authenticated: true
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case NEED_VERIFICATION:
      return {
        ...state,
        needVerification: true
      }
    case SET_SUCCESS:
      return {
        ...state,
        success: action.payload
      }
    default: 
      return state;
  }
}
