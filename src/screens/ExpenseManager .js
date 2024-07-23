import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, deleteExpense, updateExpense } from '../redux/reducers/expenseReducer';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { addExpenseAPI, deleteExpenseApi, fetchExpenses, updateExpenseApi } from '../redux/actions/ExpenseAction';
import moment from 'moment';


const ExpenseManager = () => {
    const dispatch = useDispatch();
    const expenses = useSelector(state => state.expenses.expenses);

    const [id, setId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('income');
    const [amount, setAmount] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchExpenses())
    }, [dispatch]);

    const handleAddExpense = () => {

        if (!title || !date || !type || !amount) {
            alert('Vui Lòng Không Bỏ Trống Dữ Liệu');
            return;
        }

        const newExpense = {
            title,
            description,
            date,
            type,
            amount: parseFloat(amount),
        };
        dispatch(addExpenseAPI(newExpense));
        setTitle('');
        setDescription('');
        setDate('');
        setType('income');
        setAmount('');
        setAddModalVisible(false);
    };

    const handleDeleteExpense = (id) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa khoản chi tiêu này?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel delete"),
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        dispatch(deleteExpenseApi(id));
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handleEditExpense = (expense) => {
        setId(expense.id)
        setTitle(expense.title);
        setDescription(expense.description);
        setDate(moment(expense.date).format('YYYY-MM-DD'));
        setType(expense.type);
        setAmount(expense.amount.toString());
        setUpdateModalVisible(true);
    };

    const handleUpdateExpense = () => {
        const updatedExpense = {
            id,
            title,
            description,
            date,
            type,
            amount: parseFloat(amount),
        };
        dispatch(updateExpenseApi(updatedExpense)).then((result) => {
            // console.log(result);

            console.log('Todo update successfully!');
            setTitle('');
            setDescription('');
            setDate('');
            setType('income');
            setAmount('');
            setUpdateModalVisible(false);
        })
            .catch((error) => {
                console.error('Error update todo:', error);
            });

    };

    const filteredExpenses = expenses.filter(expense =>
        expense.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalIncome = expenses.filter(expense => expense.type === 'income')
        .reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpense = expenses.filter(expense => expense.type === 'expense')
        .reduce((sum, expense) => sum + expense.amount, 0);

    const openAddModal = () => {
        setAddModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.expenseItem,
                { backgroundColor: item.type === 'income' ? 'rgba(162, 244, 176, 0.8)' : 'rgba(243, 157, 157, 0.8)' }
            ]}
            onLongPress={() => handleEditExpense(item)}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseText}>Chi tiết:  {item.description}</Text>
                <Text style={styles.expenseText}>Ngày: {moment(item.date).format('YYYY-MM-DD')}</Text>
                <Text style={styles.expenseText}>Loại: {item.type}</Text>
                <Text style={styles.expenseText}>Giá Trị: {item.amount} VND</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: 'rgba(39, 245, 212, 0.8)', padding: 7, borderRadius: 10, }} onPress={() => handleDeleteExpense(item.id)} >
                <Text style={{ fontWeight: 'bold' }}> Xóa </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Quản Lý Thu Chi</Text>
            </View>


            <TextInput
                placeholder="Search by Title"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
            />

            <View style={{ borderWidth: 1, backgroundColor: 'white', borderRadius: 10, width: '70%', padding: 10, marginBottom: 10 }}>
                <Text style={styles.totalText}>Total Income: {totalIncome}</Text>
                <Text style={styles.totalText}>Total Expense: {totalExpense}</Text>
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />



            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                <Text style={{ fontSize: 40 }}>+</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={addModalVisible}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalViewAdd}>
                    <View style={styles.modalBlockAdd}>
                        <Text style={styles.modalTitle}>Add New Expense</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date"
                            value={date}
                            onChangeText={setDate}
                        />
                        <View style={styles.typeButtonContainer}>
                            <TouchableOpacity
                                style={[styles.typeButton, type === 'income' && styles.selectedTypeButton]}
                                onPress={() => setType('income')}
                            >
                                <Text style={styles.typeButtonText}>Income</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, type === 'expense' && styles.selectedTypeButton]}
                                onPress={() => setType('expense')}
                            >
                                <Text style={styles.typeButtonText}>Expense</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={handleAddExpense} style={styles.btnTask}>
                                <Text style={styles.btnText}>Add Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTask} onPress={() => setAddModalVisible(false)} >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={styles.modalViewAdd}>
                    <View style={styles.modalBlockAdd}>
                        <Text style={styles.modalTitle}>Update Expense</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date"
                            value={date}
                            onChangeText={setDate}
                        />
                        <View style={styles.typeButtonContainer}>
                            <TouchableOpacity
                                style={[styles.typeButton, type === 'income' && styles.selectedTypeButton]}
                                onPress={() => setType('income')}
                            >
                                <Text style={styles.typeButtonText}>Income</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, type === 'expense' && styles.selectedTypeButton]}
                                onPress={() => setType('expense')}
                            >
                                <Text style={styles.typeButtonText}>Expense</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={handleUpdateExpense} style={styles.btnTask}>
                                <Text style={styles.btnText}>Update Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTask} onPress={() => setUpdateModalVisible(false)} >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEEFDD',
        flex: 1,
        padding: 20,
    },
    header: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 18,
        width: '100%',
        elevation: 7
    },
    expenseItem: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 10,
        marginBottom: 10,
    },
    expenseTitle: {
        marginBottom: 5,
        fontSize: 26,
        fontWeight: 'bold',
    },
    expenseText: {
        fontSize: 15,
        fontWeight: '700'
    },
    modalViewAdd: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBlockAdd: {
        borderWidth: 1,
        width: '90%',
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 20,
        elevation: 10
    },
    addButton: {
        backgroundColor: 'rgba(0, 157, 97, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 7
    },
    btnTask: {
        backgroundColor: 'rgba(0, 157, 97, 0.9)',
        width: '45%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    btnText: {
        fontWeight: 'bold',
        padding: 10,
        fontSize: 15,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '800'
    },
    typeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    typeButton: {
        paddingHorizontal: 7,
        paddingVertical: 7,
        backgroundColor: '#3CB371',
        borderRadius: 20,
        marginHorizontal: 10,
    },
    selectedTypeButton: {
        backgroundColor: '#FF6347',
        borderWidth: 1,
    },
    typeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ExpenseManager;
