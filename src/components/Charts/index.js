import React from 'react';
import { Line } from '@ant-design/charts';
import { Pie } from '@ant-design/charts';

function ChartComponent({sortedTransactions}) {
    const data = sortedTransactions.map((item) => {
        return { date: item.date, amount: item.amount };
    })

    const spendingData = sortedTransactions.filter((transaction) => {
        if(transaction.type == "expense"){
            return {tag: transaction.tag, amount: transaction.amount};
        }
    });

    let finalSpendings = spendingData.reduce((acc, obj) => {
        let key = obj.tag;
        if(!acc[key]) {
            acc[key] = { tag: obj.tag, amount: obj.amount }; //create a new object with the same properties
        }else{
            acc[key].amount += obj.amount;
        }
        return acc;
    }, {});
    
    const config = {
        data: data,
        width: 500,
        autoFit: false,
        xField: 'date',
        yField: 'amount',
    };
    let chart;
    let pieChart;

    const spendingConfig = {
        data: Object.values(finalSpendings),
        width: 300,
        angleField: "amount",
        colorField: "tag",
    }

    return (
        <div className = "charts-wrapper">
            <div style = {{width: "50%"}}>
                <h2>Your Analytics</h2>
                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
            </div>
            <div style = {{width: "30%"}}>
                <h2>Your Spendings</h2>
                <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
            </div>
        </div>
    )
}

export default ChartComponent