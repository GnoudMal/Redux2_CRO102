import { createSlice } from '@reduxjs/toolkit';
import { addExpenseAPI, deleteExpenseApi, updateExpenseApi } from '../actions/ExpenseAction';


const initialState = {
    expenses: [],
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense: (state, action) => {
            state.expenses.push(action.payload);
        },
        // deleteExpense: (state, action) => {
        //     state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
        // },
        // updateExpense: (state, action) => {
        //     const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        //     if (index !== -1) {
        //         state.expenses[index] = action.payload;
        //     }
        // },
    },
    extraReducers: builder => {
        builder.addCase(deleteExpenseApi.fulfilled, (state, action) => {
            state.expenses = state.expenses.filter(row => row.id !== action.payload);

        }).addCase(deleteExpenseApi.rejected, (state, action) => {
            console.log('Delete expenses rejected:', action.error.message);
        });

        builder.addCase(addExpenseAPI.fulfilled, (state, action) => {
            state.expenses.push(action.payload);
        })
            .addCase(addExpenseAPI.rejected, (state, action) => {
                console.log('Add Expense rejected:', action.error.message);
            });

        builder.addCase(updateExpenseApi.fulfilled, (state, action) => {
            const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
            if (index !== -1) {
                state.expenses[index] = action.payload;
            }
        }).addCase(updateExpenseApi.rejected, (state, action) => {
            console.log('Update Expense rejected:', action.error.message);
        });
    },
});

export const { addExpense, deleteExpense, updateExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
