import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { videos } from "../fakeData.js/Data";
import axios from "axios";

const initialState = {
  videos: [],
  filterVideos: [],
  // videos: videos,
  // filterVideos: videos,
  isEdit: false,
  videoToEdit: {},
  show: false,
};

export const getPost = createAsyncThunk(
  "appSlice/getPost",
  async (arg, { dispatch, getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get("/post");
      dispatch(setfilterVideos(data.data));
      return data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const savePost = createAsyncThunk(
  "appSlice/savePosts",
  async (arg, { dispatch, getState, rejectWithValue }) => {
    try {
      console.log(arg);
      await axios.post(`/post`, arg);
      dispatch(getPost());
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "appSlice/deletePosts",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/post/${id}`);
      dispatch(getPost());
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "appSlice/updatePosts",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      await axios.put(`/post/${arg._id}`, arg);
      dispatch(getPost());
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setfilterVideos(state, action) {
      state.filterVideos = action.payload;
    },

    setIsEdit(state, action) {
      state.isEdit = action.payload;
    },

    setvideoToEdit(state, action) {
      state.videoToEdit = action.payload;
    },

    handleClose(state) {
      state.show = false;
    },
    handleShow(state) {
      state.show = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPost.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPost.fulfilled, (state, action) => {
      state.videos = action.payload;
      state.filterVideos = action.payload;

      state.isLoading = false;
    });

    builder.addCase(deletePost.rejected, (state, action) => {
      console.log(action.payload);
    });

    builder.addCase(savePost.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(savePost.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(updatePost.rejected, (state, action) => {
      console.log(action.payload);
    });

    builder.addCase(savePost.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
      alert("los campos son requeridos");
    });
  },
});

export const {
  setfilterVideos,
  setIsEdit,
  setvideoToEdit,
  handleClose,
  handleShow,
} = appSlice.actions;

export default appSlice.reducer;
