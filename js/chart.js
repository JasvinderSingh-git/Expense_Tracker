/* ==========================================
   EXPENSE TRACKER
   chart.js
   Chart Manager
========================================== */

let categoryChart = null;
let monthlyChart = null;


/* ==========================================
   CATEGORY COLORS
========================================== */

const CHART_COLORS = {

    Food: "#22c55e",

    Fuel: "#f97316",

    Shopping: "#8b5cf6",

    Bills: "#ef4444",

    Travel: "#0ea5e9",

    Education: "#14b8a6",

    Medical: "#ec4899",

    Entertainment: "#6366f1",

    Others: "#64748b"

};


/* ==========================================
   CATEGORY TOTALS
========================================== */

function getCategoryTotals(expenses){

    const totals = {};

    expenses.forEach(expense=>{

        if(!totals[expense.category]){

            totals[expense.category]=0;

        }

        totals[expense.category]+=Number(expense.amount);

    });

    return totals;

}


/* ==========================================
   MONTHLY TOTALS
========================================== */

function getMonthlyTotals(expenses){

    const months=[

        "Jan","Feb","Mar","Apr","May","Jun",

        "Jul","Aug","Sep","Oct","Nov","Dec"

    ];

    const totals=new Array(12).fill(0);

    expenses.forEach(expense=>{

        const month=new Date(expense.date).getMonth();

        totals[month]+=Number(expense.amount);

    });

    return{

        labels:months,

        values:totals

    };

}


/* ==========================================
   CATEGORY PIE CHART
========================================== */

function renderCategoryChart(expenses){

    const totals=getCategoryTotals(expenses);

    const labels=Object.keys(totals);

    const values=Object.values(totals);

    const colors=labels.map(

        category=>CHART_COLORS[category]||"#64748b"

    );

    const ctx=document

        .getElementById("categoryChart")

        .getContext("2d");

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels,

            datasets:[{

                data:values,

                backgroundColor:colors,

                borderWidth:0,

                hoverOffset:10

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom"

                }

            },

            animation:{

                duration:1000

            }

        }

    });

}


/* ==========================================
   MONTHLY BAR CHART
========================================== */

function renderMonthlyChart(expenses){

    const data=getMonthlyTotals(expenses);

    const ctx=document

        .getElementById("monthlyChart")

        .getContext("2d");

    if(monthlyChart){

        monthlyChart.destroy();

    }

    monthlyChart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:data.labels,

            datasets:[{

                label:"Expenses",

                data:data.values,

                borderRadius:10,

                backgroundColor:"#2563eb"

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true

                }

            },

            animation:{

                duration:1000

            }

        }

    });

}


/* ==========================================
   UPDATE CHARTS
========================================== */

function updateCharts(expenses = loadExpenses()){

    renderCategoryChart(expenses);

    renderMonthlyChart(expenses);

}


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        updateCharts();

    }

);