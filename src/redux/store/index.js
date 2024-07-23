import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from '../reducers/expenseReducer';

export default configureStore({
    reducer: {
        expenses: expenseReducer,
    },
});
