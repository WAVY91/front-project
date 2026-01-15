import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ngos: [
    {
      id: 1,
      name: 'Water for All',
      email: 'water@example.com',
      description: 'Providing clean water solutions',
      verified: true,
      status: 'active',
      registrationDoc: 'cert123.pdf',
    },
    {
      id: 2,
      name: 'Bright Future',
      email: 'bright@example.com',
      description: 'Education for underprivileged children',
      verified: true,
      status: 'active',
      registrationDoc: 'cert124.pdf',
    },
    {
      id: 3,
      name: 'Health Care Plus',
      email: 'health@example.com',
      description: 'Healthcare initiatives',
      verified: true,
      status: 'active',
      registrationDoc: 'cert125.pdf',
    },
  ],
  pendingNGOs: [
    {
      id: 4,
      name: 'Future Leaders',
      email: 'leaders@example.com',
      description: 'Youth empowerment program',
      verified: false,
      status: 'pending',
      registrationDoc: 'cert126.pdf',
    },
  ],
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchNGOsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchNGOsSuccess: (state, action) => {
      state.ngos = action.payload
      state.loading = false
    },
    fetchNGOsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    registerNGO: (state, action) => {
      const newNGO = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        verified: false,
        status: 'pending',
      }
      state.pendingNGOs.push(newNGO)
    },
    approveNGO: (state, action) => {
      const ngoIndex = state.pendingNGOs.findIndex((n) => n.id === action.payload || n._id === action.payload)
      if (ngoIndex !== -1) {
        const ngo = state.pendingNGOs[ngoIndex]
        ngo.verified = true
        ngo.status = 'active'
        state.ngos.push(ngo)
        state.pendingNGOs.splice(ngoIndex, 1)
      }
    },
    rejectNGO: (state, action) => {
      const ngoIndex = state.pendingNGOs.findIndex((n) => n.id === action.payload || n._id === action.payload)
      if (ngoIndex !== -1) {
        state.pendingNGOs.splice(ngoIndex, 1)
      }
    },
  },
})

export const {
  fetchNGOsStart,
  fetchNGOsSuccess,
  fetchNGOsFailure,
  registerNGO,
  approveNGO,
  rejectNGO,
} = userSlice.actions

export default userSlice.reducer
