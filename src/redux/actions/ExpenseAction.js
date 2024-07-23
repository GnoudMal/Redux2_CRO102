import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addExpense } from '../reducers/expenseReducer';

const api_url = 'https://6698acaf2069c438cd6f7970.mockapi.io/Expense';

export const fetchExpenses = () => {
  return async dispatch => {
    try {
      const response = await axios.get(api_url);
      const data = response.data;
      console.log(data);
      data.forEach(row => {
        dispatch(addExpense(row));
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
};

export const deleteExpenseApi = createAsyncThunk(
  'expense/deleteExpenseApi',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${api_url}/${id}`);

      if (response.status === 200) {
        return id;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addExpenseAPI = createAsyncThunk(
  'expense/addExpenseAPI',
  async (objExpense, thunkAPI) => {
    console.log(objExpense);
    try {
      const response = await axios.post(api_url, objExpense, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateExpenseApi = createAsyncThunk(
  'expense/updateExpenseApi',
  async (objUpdate, thunkAPI) => {
    console.log(objUpdate.data);
    try {
      const response = await axios.put(`${api_url}/${objUpdate.id}`, objUpdate, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
