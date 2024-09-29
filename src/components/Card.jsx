import React from 'react'
import locicon from '../assets/locationicon.jpg'
import timeicon from '../assets/time.jpg'
import date from 'date-and-time'
import { useNavigate } from 'react-router-dom';

function Card({ data = {} }) {
    let navigate = useNavigate()
    const eventdate = new Date(data.date);
    return <>
        <div>
            <div key={data.id} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                <img
                    src={data.image}
                    className="img-fluid product-img"
                    alt="..."
                    style={{ borderRadius: "30px", height:"400px" }}
                  />
                </div>
                <h3 className="mt-6 font-semibold text-sm text-gray-900">
                    <a href={data.href}>
                        <span className="absolute inset-0" />
                        {data.title}
                    </a>
                </h3>
                &nbsp;
                <div className='location' >
                    <img className="h-6 w-7" src={locicon} />
                    <p className="text-base text-gray-900">{data.location[0]}</p>
                </div>
                <div className='location' >
                    <img className="h-8 w-8" src={timeicon} />
                    <p className="text-base text-gray-900">{eventdate.toDateString()} | {data.time}</p>
                </div>
                <div className='price' >
                    <p className="text-base text-gray-900">₹{data.price[0]} ONWARDS</p>
                </div>
            </div>
            <div className='btn-buy'>
            <button onClick={()=>navigate(`/event/${data.id}`)} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">BUY NOW</button>
        </div>
        </div>
    </>
}

export default Card