/* ==========================================
   EXPENSE TRACKER
   expense.js
   Part 1
========================================== */


/* ==========================================
   STATE
========================================== */

let expenses = loadExpenses();

let editingExpenseId = null;

let enteredAmount = 0;


/* ==========================================
   ELEMENTS
========================================== */

const amountSheet = $("#amountSheet");

const expenseSheet = $("#expenseSheet");

const amountInput = $("#expenseAmount");

const expenseNameInput = $("#expenseName");

const categoryInput = $("#category");

const expenseDateInput = $("#expenseDate");

const nextBtn = $("#nextBtn");

const saveBtn = $("#saveExpense");


/* ==========================================
   OPEN AMOUNT SHEET
========================================== */

function openAmountSheet(){

    enteredAmount = 0;

    editingExpenseId = null;

    amountInput.value = "";

    amountSheet.classList.add("active");

    amountInput.focus();

}


/* ==========================================
   CLOSE AMOUNT SHEET
========================================== */

function closeAmountSheet(){

    amountSheet.classList.remove("active");

}


/* ==========================================
   OPEN DETAILS SHEET
========================================== */

function openExpenseSheet(){

    expenseNameInput.value = "";

    categoryInput.value = "Food";

    expenseDateInput.value = todayDate();

    expenseSheet.classList.add("active");

    expenseNameInput.focus();

}


/* ==========================================
   CLOSE DETAILS SHEET
========================================== */

function closeExpenseSheet(){

    expenseSheet.classList.remove("active");

}


/* ==========================================
   NEXT BUTTON
========================================== */

function handleNext(){

    const amount = Number(

        amountInput.value

    );

    if(!isPositive(amount)){

        showToast(

            "Enter a valid amount."

        );

        amountInput.focus();

        return;

    }

    enteredAmount = amount;

    closeAmountSheet();

    openExpenseSheet();

}


/* ==========================================
   RESET FORM
========================================== */

function resetExpenseForm(){

    enteredAmount = 0;

    editingExpenseId = null;

    amountInput.value = "";

    expenseNameInput.value = "";

    categoryInput.value = "Food";

    expenseDateInput.value = todayDate();

}


/* ==========================================
   CREATE EXPENSE OBJECT
========================================== */

function createExpense(){

    return{

        id:generateId(),

        amount:enteredAmount,

        name:expenseNameInput.value.trim(),

        category:categoryInput.value,

        date:expenseDateInput.value,

        createdAt:new Date().toISOString()

    };

}


/* ==========================================
   VALIDATE FORM
========================================== */

function validateExpense(){

    if(

        isEmpty(

            expenseNameInput.value

        )

    ){

        showToast(

            "Enter expense description."

        );

        expenseNameInput.focus();

        return false;

    }

    if(

        !isPositive(

            enteredAmount

        )

    ){

        showToast(

            "Invalid amount."

        );

        return false;

    }

    return true;

}


/* ==========================================
   OPEN ADD BUTTON
========================================== */

$("#addExpenseBtn")

.addEventListener(

    "click",

    openAmountSheet

);


/* ==========================================
   NEXT BUTTON
========================================== */

nextBtn

.addEventListener(

    "click",

    handleNext

);


/* ==========================================
   ENTER KEY
========================================== */

amountInput

.addEventListener(

    "keydown",

    event=>{

        if(event.key==="Enter"){

            handleNext();

        }

    }

);


/* ==========================================
   EXPENSE TRACKER
   expense.js
   Part 2
   Save Expense
========================================== */


/* ==========================================
   SAVE EXPENSE
========================================== */

function saveExpense(){

    if(!validateExpense()){

        return;

    }

    showLoader();

    const expense = createExpense();

    expenses.push(expense);

    saveExpenses(expenses);

    refreshUI();

    closeExpenseSheet();

    resetExpenseForm();

    hideLoader();

    showToast("Expense Added Successfully");

}


/* ==========================================
   UPDATE SUMMARY
========================================== */

function updateSummaryCards(data = expenses){

    const total = data.reduce(

        (sum, expense) =>

            sum + Number(expense.amount),

        0

    );

    const today = data

        .filter(expense =>

            isToday(expense.date)

        )

        .reduce(

            (sum, expense) =>

                sum + Number(expense.amount),

            0

        );

    const month = data

        .filter(expense =>

            isThisMonth(expense.date)

        )

        .reduce(

            (sum, expense) =>

                sum + Number(expense.amount),

            0

        );

    $("#totalExpense").textContent =

        formatCurrency(total);

    $("#todayExpense").textContent =

        formatCurrency(today);

    $("#monthExpense").textContent =

        formatCurrency(month);

}


/* ==========================================
   REFRESH UI
========================================== */

function refreshUI(){

    expenses = loadExpenses();

    const filteredExpenses = getFilteredExpenses();

    renderExpenseList(filteredExpenses);

    updateSummaryCards(filteredExpenses);

    updateCharts(filteredExpenses);

}


/* ==========================================
   CLOSE SHEETS
========================================== */

window.addEventListener(

    "click",

    event=>{

        if(event.target===amountSheet){

            closeAmountSheet();

        }

        if(event.target===expenseSheet){

            closeExpenseSheet();

        }

    }

);


/* ==========================================
   ESC KEY
========================================== */

document.addEventListener(

    "keydown",

    event=>{

        if(event.key==="Escape"){

            closeAmountSheet();

            closeExpenseSheet();

        }

    }

);


/* ==========================================
   SAVE BUTTON
========================================== */

saveBtn

.addEventListener(

    "click",

    saveExpense

);


/* ==========================================
   ENTER KEY
========================================== */

expenseNameInput

.addEventListener(

    "keydown",

    event=>{

        if(event.key==="Enter"){

            saveExpense();

        }

    }

);




/* ==========================================
   EXPENSE TRACKER
   expense.js
   Part 3
   Render Expenses
========================================== */


/* ==========================================
   CATEGORY CLASS
========================================== */

function getCategoryClass(category){

    switch(category){

        case "Food":

            return "food";

        case "Fuel":

            return "fuel";

        case "Shopping":

            return "shopping";

        case "Bills":

            return "bills";

        case "Travel":

            return "travel";

        case "Education":

            return "education";

        case "Medical":

            return "medical";

        case "Entertainment":

            return "entertainment";

        default:

            return "others";

    }

}


/* ==========================================
   EXPENSE CARD
========================================== */

function createExpenseCard(expense){

    const icon = getCategoryIcon(

        expense.category

    );

    const categoryClass =

        getCategoryClass(

            expense.category

        );

    return `

    <div class="expense-card">

        <div class="expense-left">

            <div class="expense-icon ${categoryClass}">

                ${icon}

            </div>

            <div class="expense-details">

                <div class="expense-name">

                    ${expense.name}

                </div>

                <div class="expense-category">

                    ${expense.category}

                </div>

                <div class="expense-date">

                    ${formatDate(expense.date)}

                </div>

            </div>

        </div>

        <div class="expense-right">

            <div class="expense-amount">

                ${formatCurrency(expense.amount)}

            </div>

            <div class="card-actions">

                <button

                    class="icon-btn edit-btn"

                    onclick="editExpense(${expense.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button

                    class="icon-btn delete-btn"

                    onclick="removeExpense(${expense.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

    </div>

    `;

}


/* ==========================================
   RENDER EXPENSES
========================================== */

function renderExpenseList(

    data = expenses

){

    const container =

        $("#expenseList");

    if(data.length===0){

        container.innerHTML=`

        <div class="empty-state">

            <i class="fa-solid fa-wallet"></i>

            <h3>

                No Expenses Yet

            </h3>

            <p>

                Click the + button to

                add your first expense.

            </p>

        </div>

        `;

        return;

    }

    const sorted =

        [...data].sort(

            (a,b)=>

            new Date(b.date)-

            new Date(a.date)

        );

    container.innerHTML =

        sorted

        .map(

            expense=>

            createExpenseCard(expense)

        )

        .join("");

}


/* ==========================================
   DELETE EXPENSE
========================================== */

function removeExpense(id){

    if(

        !confirmDelete(

            "Delete this expense?"

        )

    ){

        return;

    }

    expenses =

        expenses.filter(

            expense=>

            expense.id!==id

        );

    saveExpenses(expenses);

    refreshUI();

    showToast(

        "Expense Deleted"

    );

}


/* ==========================================
   TOTAL EXPENSE
========================================== */

function getTotalExpense(

    data = expenses

){

    return data.reduce(

        (sum,expense)=>

        sum +

        Number(

            expense.amount

        ),

        0

    );

}


/* ==========================================
   TOTAL COUNT
========================================== */

function getExpenseCount(){

    return expenses.length;

}



/* ==========================================
   EXPENSE TRACKER
   expense.js
   Part 4
   Edit & Search
========================================== */


/* ==========================================
   EDIT EXPENSE
========================================== */

function editExpense(id){

    const expense = expenses.find(

        item => item.id === id

    );

    if(!expense){

        return;

    }

    editingExpenseId = id;

    enteredAmount = Number(expense.amount);

    expenseNameInput.value = expense.name;

    categoryInput.value = expense.category;

    expenseDateInput.value = expense.date;

    closeAmountSheet();

    expenseSheet.classList.add("active");

    expenseNameInput.focus();

}


/* ==========================================
   UPDATE EXPENSE
========================================== */

function updateExpenseData(){

    if(!validateExpense()){

        return;

    }

    const index = expenses.findIndex(

        item => item.id === editingExpenseId

    );

    if(index === -1){

        return;

    }

    expenses[index] = {

        ...expenses[index],

        amount: enteredAmount,

        name: expenseNameInput.value.trim(),

        category: categoryInput.value,

        date: expenseDateInput.value

    };

    saveExpenses(expenses);

    refreshUI();

    closeExpenseSheet();

    resetExpenseForm();

    editingExpenseId = null;

    showToast("Expense Updated");

}


/* ==========================================
   MODIFY SAVE BUTTON
========================================== */

function handleSave(){

    if(editingExpenseId !== null){

        updateExpenseData();

    }

    else{

        saveExpense();

    }

}


/* ==========================================
   SEARCH
========================================== */

function searchExpenses(keyword){

    keyword = keyword

        .toLowerCase()

        .trim();

    const filtered = expenses.filter(

        expense =>

            expense.name

                .toLowerCase()

                .includes(keyword)

            ||

            expense.category

                .toLowerCase()

                .includes(keyword)

    );

    renderExpenseList(filtered);

}


/* ==========================================
   CLEAR SEARCH
========================================== */

function clearSearch(){

    renderExpenseList(

        getFilteredExpenses()

    );

}


/* ==========================================
   SEARCH EVENT
========================================== */

const searchInput = $("#searchInput");

if(searchInput){

    searchInput.addEventListener(

        "input",

        function(){

            const value =

                this.value.trim();

            if(value===""){

                clearSearch();

            }

            else{

                searchExpenses(value);

            }

        }

    );

}


/* ==========================================
   VIEW ALL
========================================== */

const viewAllBtn = $("#viewAllBtn");

if(viewAllBtn){

    viewAllBtn.addEventListener(

        "click",

        ()=>{

            currentFilter = "all";

            renderExpenseList(expenses);

            updateSummaryCards(expenses);

            updateCharts(expenses);

            updateFilterButtons();

            showToast("Showing All Expenses");

        }

    );

}


/* ==========================================
   SAVE BUTTON
========================================== */

saveBtn.removeEventListener(

    "click",

    saveExpense

);

saveBtn.addEventListener(

    "click",

    handleSave

);




/* ==========================================
   EXPENSE TRACKER
   expense.js
   Part 5
   Initialization
========================================== */


/* ==========================================
   GREETING
========================================== */

function updateGreeting(){

    const greeting = $("#greeting");

    if(!greeting) return;

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.textContent = "Good Morning ☀️";

    }

    else if(hour < 17){

        greeting.textContent = "Good Afternoon 🌤️";

    }

    else if(hour < 21){

        greeting.textContent = "Good Evening 🌇";

    }

    else{

        greeting.textContent = "Good Night 🌙";

    }

}


/* ==========================================
   DEFAULT DATE
========================================== */

function initializeDate(){

    if(expenseDateInput){

        expenseDateInput.value = todayDate();

    }

}


/* ==========================================
   RESET WHEN CLOSED
========================================== */

function closeAllSheets(){

    closeAmountSheet();

    closeExpenseSheet();

    resetExpenseForm();

}


/* ==========================================
   SHORTCUTS
========================================== */

document.addEventListener(

    "keydown",

    event=>{

        // Ctrl + N

        if(event.ctrlKey && event.key==="n"){

            event.preventDefault();

            openAmountSheet();

        }

        // Escape

        if(event.key==="Escape"){

            closeAllSheets();

        }

    }

);


/* ==========================================
   AUTO REFRESH
========================================== */

function initializeDashboard(){

    expenses = loadExpenses();

    updateGreeting();

    initializeDate();

    refreshUI();

}


/* ==========================================
   WINDOW FOCUS
========================================== */

window.addEventListener(

    "focus",

    ()=>{

        expenses = loadExpenses();

        refreshUI();

    }

);


/* ==========================================
   STORAGE UPDATE
========================================== */

window.addEventListener(

    "storage",

    ()=>{

        expenses = loadExpenses();

        refreshUI();

    }

);


/* ==========================================
   INITIALIZE APP
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeDashboard();

    }

);


/* ==========================================
   DEBUG HELPERS
========================================== */

window.expenseApp = {

    getExpenses(){

        return expenses;

    },

    clear(){

        if(confirmDelete("Delete all expenses?")){

            expenses = [];

            saveExpenses(expenses);

            refreshUI();

            showToast("All Expenses Deleted");

        }

    },

    total(){

        return getTotalExpense();

    }

};