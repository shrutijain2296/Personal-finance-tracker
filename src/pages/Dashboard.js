import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import TransactiosTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {

  const [transactions, setTransactions] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () =>{
    setIsExpenseModalVisible(true);
  }
  const showIncomeModal = () =>{
    setIsIncomeModalVisible(true);
  }
  const handleExpenseCancel = () =>{
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel = () =>{
    setIsIncomeModalVisible(false);
  }
  const onFinish = (values, type) => {  //value is the object that we have and type is -> income/expense
    const newTransaction = {
        type: type,  //income/exoense
        date: values.date.format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
        tag: values.tag,
        name: values.name,
    }
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many){
    try{
        const docRef = await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
        );
        console.log("Document written with ID: ", docRef.id);
        if(!many)
        toast.success("Transaction Added!"); 
        let newArr = transactions; //adding new transaction to to existing transaction
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
    }
    catch(e){
        console.log("Error adding document: ", e);
        if (!many) toast.error("Couldn't add transaction")
    }
  } 

  useEffect(() => {
    // get all docs from a collection
    fetchTransactions();  
  }, [user]);

  useEffect (() => { //whenever my  transaction is changing useEffect will get invoked and calculateBalance function will run  
    calculateBalance();
  }, [transactions])

  function calculateBalance(){
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => { //transactions array is an object that contains type i.e income or expense
        if(transaction.type === "income"){
            incomeTotal += transaction.amount;
        }else{
            expenseTotal += transaction.amount;
        }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      // toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let date = new Date();

  let sortedTransactions = transactions.sort((a,b) =>{
    return new Date(a.date) - new Date(b.date)
  })

  return (
    <div>
        <Header />
        {
            loading ? (
                <p>Loading...</p>
            ) : (
            <>
                <Cards 
                    income = {income}
                    expense = {expense}
                    totalBalance = {totalBalance}
                    showExpenseModal = {showExpenseModal} 
                    showIncomeModal = {showIncomeModal}
                />
                {transactions && transactions.length != 0 ? <ChartComponent sortedTransactions = {sortedTransactions}/>: <NoTransactions/> }
                <AddExpenseModal
                    isExpenseModalVisible = {isExpenseModalVisible}
                    handleExpenseCancel = {handleExpenseCancel}
                    onFinish = {onFinish}
                />
                <AddIncomeModal
                    isIncomeModalVisible = {isIncomeModalVisible}
                    handleIncomeCancel = {handleIncomeCancel}
                    onFinish = {onFinish}
                />
                <TransactiosTable transactions = {transactions} addTransaction={addTransaction} fetchTransactions = {fetchTransactions}/>
            </>

        )}
       
        
    </div>
  )
}

export default Dashboard


//   const transactions = [
//     {
//         type: "income",
//         amount: 2000,
//         tag: "salary",
//         name: "income",
//         date: "2023-09-17"
//     },
//     {
//         type: "expense",
//         amount: 200,
//         tag: "food",
//         name: "expense",
//         date: "2023-09-10"
//     },
//   ]