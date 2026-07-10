/* ==========================================
   EXPENSE TRACKER
   filter.js
   Expense Filters
========================================== */

let currentFilter = loadSettings().filter || "month";

let customStartDate = null;
let customEndDate = null;


/* ==========================================
   TODAY
========================================== */

function isToday(date){

    const today = new Date();

    const d = new Date(date);

    return (

        today.getDate() === d.getDate() &&

        today.getMonth() === d.getMonth() &&

        today.getFullYear() === d.getFullYear()

    );

}


/* ==========================================
   THIS WEEK
========================================== */

function isThisWeek(date){

    const today = new Date();

    const d = new Date(date);

    const diff = today - d;

    return diff <= 7 * 24 * 60 * 60 * 1000 && diff >= 0;

}


/* ==========================================
   THIS MONTH
========================================== */

function isThisMonth(date){

    const today = new Date();

    const d = new Date(date);

    return (

        today.getMonth() === d.getMonth() &&

        today.getFullYear() === d.getFullYear()

    );

}


/* ==========================================
   THIS YEAR
========================================== */

function isThisYear(date){

    return (

        new Date(date).getFullYear() ===

        new Date().getFullYear()

    );

}


/* ==========================================
   CUSTOM RANGE
========================================== */

function isCustomRange(date){

    if(!customStartDate || !customEndDate){

        return true;

    }

    const d = new Date(date);

    return (

        d >= new Date(customStartDate) &&

        d <= new Date(customEndDate)

    );

}


/* ==========================================
   FILTER EXPENSES
========================================== */

function getFilteredExpenses(){

    const expenses = loadExpenses();

    switch(currentFilter){

        case "today":

            return expenses.filter(expense =>

                isToday(expense.date)

            );

        case "week":

            return expenses.filter(expense =>

                isThisWeek(expense.date)

            );

        case "month":

            return expenses.filter(expense =>

                isThisMonth(expense.date)

            );

        case "year":

            return expenses.filter(expense =>

                isThisYear(expense.date)

            );

        case "custom":

            return expenses.filter(expense =>

                isCustomRange(expense.date)

            );

        case "all":

            return expenses;    

        default:

            return expenses;

    }

}


/* ==========================================
   CHANGE FILTER
========================================== */

function changeFilter(filter){

    currentFilter = filter;

    updateSetting("filter", filter);

    updateFilterButtons();

    refreshDashboard();

}


/* ==========================================
   FILTER BUTTONS
========================================== */

function updateFilterButtons(){

    document

        .querySelectorAll(".filter")

        .forEach(button=>{

            button.classList.remove("active");

            if(button.dataset.filter===currentFilter){

                button.classList.add("active");

            }

        });

}


/* ==========================================
   CUSTOM DATES
========================================== */

function setCustomDates(startDate,endDate){

    customStartDate = startDate;

    customEndDate = endDate;

    currentFilter = "custom";

    updateFilterButtons();

    refreshDashboard();

}


/* ==========================================
   DASHBOARD REFRESH
========================================== */

function refreshDashboard(){

    const expenses = getFilteredExpenses();

    if(typeof renderExpenseList === "function"){

        renderExpenseList(expenses);

    }

    if(typeof updateSummaryCards === "function"){

        updateSummaryCards(expenses);

    }

    if(typeof updateCharts === "function"){

        updateCharts(expenses);

    }

}


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        updateFilterButtons();

        document

            .querySelectorAll(".filter")

            .forEach(button=>{

                button.addEventListener(

                    "click",

                    ()=>{

                        changeFilter(

                            button.dataset.filter

                        );

                    }

                );

            });

    }

);