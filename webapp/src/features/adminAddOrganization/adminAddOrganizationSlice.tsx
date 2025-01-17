import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { selectToken } from '../../generalSlices/userSlice'
import EnvironmentVars from '../../EnvironmentVars'
import apiHelper from '../../apis/api-helper'
import { RootState } from '../../store'
import { getOrgData } from '../adminOrganizationTab/adminOrganizationTabSlice'
import { AdminAddOrgForm } from './AdminAddOrganization'

const initialState = {
  successMsg: '',
  errorState: false,
  errorMsg: '',
}

export const addOrg = createAsyncThunk(
  'adminAddOrganization/addOrg',
  async (
    payload: {
      json: AdminAddOrgForm
      reset: () => void
    },
    { getState, dispatch }
  ) => {
    const { json, reset } = payload
    const currentState = getState() as RootState
    const token = selectToken(currentState)

    const data = await apiHelper._postData({
      url: EnvironmentVars.adminAddOrg,
      token,
      body: JSON.stringify(json),
    })
    switch (data.status) {
      case 200:
        reset()
        dispatch(resetMsg())
        dispatch(getOrgData({ orgName: 'all', all: true, specifiedOrg: json.name }))
        return { success: true, message: 'Organization Creation is successful.' }
      default:
        dispatch(resetMsg())
        return { success: false, message: data.message }
    }
  },
  { condition: (_, { getState }) => selectToken(getState() as RootState) != undefined }
)

export const resetMsg = createAsyncThunk('adminAddOrganization/resetMsg', async (_, { dispatch }) => {
  setTimeout(() => dispatch(setSuccessMsg('')), 5000)
})

export const adminAddOrganizationSlice = createSlice({
  name: 'adminAddOrganization',
  initialState: {
    loading: false,
    value: initialState,
  },
  reducers: {
    setSuccessMsg: (state, action) => {
      state.value.successMsg = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrg.pending, (state) => {
        state.loading = true
      })
      .addCase(addOrg.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success) {
          state.value.successMsg = action.payload.message
          state.value.errorMsg = ''
          state.value.errorState = false
        } else {
          state.value.successMsg = ''
          state.value.errorMsg = action.payload.message
          state.value.errorState = true
        }
      })
      .addCase(addOrg.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setSuccessMsg } = adminAddOrganizationSlice.actions

export const selectLoading = (state: RootState) => state.adminAddOrganization.loading
export const selectSuccessMsg = (state: RootState) => state.adminAddOrganization.value.successMsg
export const selectErrorState = (state: RootState) => state.adminAddOrganization.value.errorState
export const selectErrorMsg = (state: RootState) => state.adminAddOrganization.value.errorMsg

export default adminAddOrganizationSlice.reducer
