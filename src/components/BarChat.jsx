import React from 'react'
import { BarChart } from '@mui/x-charts'

function BarChat({data}) {
    console.log(data)
    let price=[]
    let tickets=[]
    data.map((e)=>{
        price.push((e.totalamount))
        tickets.push(e.totaltickets)
    })
    console.log(price)
  return <>
  
  <div className='barclass'>
  <BarChart
  xAxis={[
    {
      id: 'barCategories',
      data: ['Music', 'Comedy', 'Workshop'],
      scaleType: 'band',
    },
  ]}
  series={[
    {
      data: price,
      label:"Total Amount"
    },
  ]}
  width={500}
  height={400}
/>

<BarChart
  xAxis={[
    {
      id: 'barCategories',
      data: ['Music', 'Comedy', 'Workshop'],
      scaleType: 'band',
    },
  ]}
  series={[
    {
      data: tickets,
      label:'Tickets Sold'
    },
  ]}
  width={500}
  height={400}
/>
</div>
  </>
}

export default BarChat