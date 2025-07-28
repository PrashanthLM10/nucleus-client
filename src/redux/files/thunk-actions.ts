import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { FileType } from "../../components/files/files.types";
import { getAPIURLWithPath } from "../../utils/api-utils";
import { fetchFilesSample } from "../../utils/sample-data";

//API's
export const fetchFilesAPI = async () => {
  return axios.get<FileType[]>(`${getAPIURLWithPath("getAllFiles")}`);

  // Mock: Respond with MockData
  /* return new Promise((res, rej) => {
    setTimeout(() => res(fetchFilesSample), 2000);
  }); */
};

export const deleteFileAPI = async (fileName: string) => {
  return axios.delete(`${getAPIURLWithPath("deleteFile")}/${fileName}`);
};

export const renameFileAPI = async (postData: {
  oldName: string;
  newName: string;
}) => {
  return axios.post(`${getAPIURLWithPath("renameFile")}`, postData);

  // Mock: Respond with MockData
  /* return new Promise((res, rej) => {
    setTimeout(() => res({ status: 200 }), 2000);
  }); */
};

// Thunk actions
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (arg: unknown, thunkAPI) => {
    return await fetchFilesAPI();
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (arg: string, thunkAPI) => {
    return await deleteFileAPI(arg);
  }
);

export const renameFile = createAsyncThunk(
  "files/renameFile",
  async (arg: { oldName: string; newName: string }, thunkAPI) => {
    const res = await renameFileAPI(arg);
    return res;
  }
);
