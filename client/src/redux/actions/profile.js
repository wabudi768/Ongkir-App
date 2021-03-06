import axios from 'axios'

export const profileState = {
  profile: {},
  type: '',
  btnText: 'Update Profile',
  btnDisabled: false,
  messages: []
}

export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export const PROFILE_FAILED = 'PROFILE_FAILED'
export const PROFILE_CLEANUP = 'PROFILE_CLEANUP'
export const PROFILE_SUCCESS_ALL = 'PROFILE_SUCCESS_ALL'

axios.interceptors.response.use((res) => {
  if (res.headers['content-type'] === 'application/json') {
    res.headers['accept'] = 'application/json'
    res.headers['content-type'] = 'application/json'
    res.config.headers['Accept'] = 'application/json'
    res.config.headers['Content-Type'] = 'application/json'
  }
  return res
})

export const editProfileActionCreator = (type, payload) => async (dispatch) => {
  const { data } = await axios.get(`/api/user/profile/${payload.id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    }
  })

  dispatch({
    type: type,
    payload: {
      profile: data.profile
    }
  })
}

export const updateProfileActionCreator = (type, payload) => async (dispatch) => {
  const { id, username, email, password } = payload
  axios
    .put(`/api/user/profile/${id}`, { username, email, password })
    .then(({ data }) => {
      dispatch({
        type: type,
        payload: {
          type: PROFILE_SUCCESS,
          btnText: payload.btnText,
          btnDisabled: payload.btnDisabled,
          messages: data.success
        }
      })
      setTimeout(() => {
        dispatch({
          type: PROFILE_CLEANUP,
          payload: { ...profileState }
        })
      }, 3000)
    })
    .catch((err) => {
      dispatch({
        type: type,
        payload: {
          type: PROFILE_FAILED,
          btnText: payload.btnText,
          btnDisabled: payload.btnDisabled,
          messages: err.response.data.error
        }
      })
      setTimeout(() => {
        dispatch({
          type: PROFILE_CLEANUP,
          payload: { ...profileState }
        })
      }, 3000)
    })
}
