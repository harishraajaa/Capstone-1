import React, { useDebugValue, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import api from '../service/apiService';
import ApiRoutes from '../utils/ApiRoutes';
import config from '../utils/config'

function SingleCart({ data = {} }) {

    const navigate = useNavigate()

    const [genquantity, setGenQuantity] = useState(0);
    const [goldquantity, setGoldQuantity] = useState(0);
    const [pquantity, setPQuantity] = useState(0);
    const [fanquantity, setFanQuantity] = useState(0);

    const [total, setTotal] = useState(0)
    let a = 0



    const handleQuantitySubGenereal = (genquantity, price) => {
        if (genquantity >= 1) {
            setGenQuantity(genquantity - 1);
            setTotal(total - Number(price))
        }
    };

    const handleQuantitySubFans = (fanquantity, price) => {
        if (fanquantity >= 1) {
            setFanQuantity(fanquantity - 1);
            setTotal(total - Number(price))
        }
    };

    const handleQuantitySubGold = (goldquantity, price) => {
        if (goldquantity >= 1) {
            setGoldQuantity(goldquantity - 1);
            setTotal(total - Number(price))
        }
    };

    const handleQuantitySubPlatinum = (pquantity, price) => {
        if (pquantity >= 1) {
            setPQuantity(pquantity - 1);
            setTotal(total - Number(price))
        }
    };

    const handleQuantityAddGenearl = (genquantity, price) => {
        if (genquantity >= 0) {
            setGenQuantity(genquantity + 1);
            setTotal(total + Number(price))
        }
    };

    const handleQuantityAddFans = (fanquantity, price) => {
        if (fanquantity >= 0) {
            setFanQuantity(fanquantity + 1);
            setTotal(total + Number(price))
        }
    };

    const handleQuantityAddPlatinum = (pquantity, price) => {
        if (genquantity >= 0) {
            setPQuantity(pquantity + 1);
            setTotal(total + Number(price))
        }
    };

    const handleQuantityAddGold = (goldquantity, price) => {
        if (goldquantity >= 0) {
            setGoldQuantity(goldquantity + 1);
            setTotal(total + Number(price))
        }
    };

    const addOrder = async (eventId, totalpayable, gqty, goldqty, pqty, fqty) => {
        try {
            const body = {
                "paymentstatus": "Paid",
                "status": "Booked",
                "totalamount": totalpayable,
                "tickets": [gqty, goldqty, pqty, fqty]
            }

            let res = await api.post(`${ApiRoutes.BOOK_EVENT.path}/${eventId}`, body, { authenticate: ApiRoutes.BOOK_EVENT.authenticate })
            console.log(res)
            toast.success(res.message)

        } catch (error) {
            toast.error(error.res.data.message)
        }
    }


    const bookEvent = async (eventId, totalpayable, gqty, goldqty, pqty, fqty) => {

        const token = sessionStorage.getItem("token")
        try {
            let amount = totalpayable;
            const response = await fetch(`${config.BASE_URL}razorpay/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, currency: 'INR', receipt: 'receipt#1', notes: {} })
            });

            const order = await response.json();

            // Open Razorpay Checkout
            const options = {
                key: 'rzp_test_G89nKX7Fo5iCem', // Replace with your Razorpay key_id
                amount: order.amount,
                currency: order.currency,
                name: 'Harish Corporation',
                description: 'Test Transaction',
                order_id: order.id, // This is the order_id created in the backend
                callback_url: `${config.BASE_URL}razorpay/payment-success`, // Your success URL
                prefill: {
                    name: 'Harish Events Management',
                    email: 'your.email@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#0d94fb'
                },
                handler: function (response) {
                    fetch(`${config.BASE_URL}razorpay/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            eventId,
                            paymentstatus: "Paid",
                            status: "Booked",
                            totalamount: totalpayable,
                            tickets: [gqty, goldqty, pqty, fqty]
                        })
                    }).then(res => res.json())
                        .then(data => {
                            console.log(data)
                            if (data.status === 'ok') {
                                //Write Fetch add order
                                navigate('/myevents')
                                toast.success("Order Created Successfully")
                            } else {
                                alert('Payment verification failed');
                            }
                        }).catch(error => {
                            console.error('Error:', error);
                            alert('Error verifying payment');
                        });
                }
            }

            const rzp = new Razorpay(options);
            rzp.open();
        }
        catch (error) {
            console.log(error.message)
            toast.error("Order amount less than minimum amount allowed")
        }
    }


    return <>
        <div className="col-12 d-flex justify-content-center align-items-center ">
            <div className="card mb-3 mt-5" style={{ width: "80%", borderRadius: "20px", height: "10%" }}>
                <div className="row g-0 ">
                    <div className="col-md-5 d-flex justify-content-center align-items-center">
                        <img
                            src={data.image}
                            className="img-fluid product-img"
                            alt="..."
                            style={{ borderRadius: "30px", height: "400px" }}
                        />
                    </div>

                    <div className="col-md-7 ">
                        <div className="row g-0">
                            <div className="col-md">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <h5 className="card-title">{data.title}</h5>
                                        </div>
                                        <div className="col">
                                            <h5 className="card-title d-flex justify-content-end ">
                                                ₹{data.price[0]} ONWARDS
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p className="card-text">
                                                <b>Category : </b>
                                                {data.category}
                                            </p>
                                        </div>
                                        <div className="col d-flex justify-content-end">

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p className="card-text">
                                                <b>Venue : </b>
                                                {data.location[1]}, {data.location[2]}, {data.location[0]}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex align-items-center">
                                            <b>General (₹{data.price[0]}) :</b>
                                        </div>
                                        <div className="col d-flex align-items-center justify-content-end">
                                            <div>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleQuantitySubGenereal(
                                                            genquantity, data.price[0]
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span> {genquantity} </span>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleQuantityAddGenearl(
                                                            genquantity, data.price[0]
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    &nbsp;
                                    <div className="row">
                                        <div className="col d-flex align-items-center">
                                            <b>Gold (₹{data.price[1]}) :</b>
                                        </div>
                                        <div className="col d-flex align-items-center justify-content-end">
                                            <div>
                                                <button className="btn btn-secondary" onClick={() => handleQuantitySubGold(goldquantity, data.price[1])}>-</button>
                                                <span> {goldquantity} </span>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleQuantityAddGold(
                                                            goldquantity, data.price[1]
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    &nbsp;
                                    <div className="row">
                                        <div className="col d-flex align-items-center">
                                            <b>Platinum (₹{data.price[2]}) :</b>
                                        </div>
                                        <div className="col d-flex align-items-center justify-content-end">
                                            <div>
                                                <button className="btn btn-secondary" onClick={() => handleQuantitySubPlatinum(pquantity, data.price[2])}>-</button>
                                                <span> {pquantity} </span>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleQuantityAddPlatinum(
                                                            pquantity, data.price[2]
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    &nbsp;
                                    <div className="row">
                                        <div className="col d-flex align-items-center">
                                            <b>Fan's Pit (₹{data.price[3]}) :</b>
                                        </div>
                                        <div className="col d-flex align-items-center justify-content-end">
                                            <div>
                                                <button className="btn btn-secondary" onClick={() => handleQuantitySubFans(fanquantity, data.price[3])}>-</button>
                                                <span> {fanquantity} </span>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleQuantityAddFans(
                                                            fanquantity, data.price[3]
                                                        )
                                                    }
                                                >                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-0 p-4 subtotal">
                            <div className="col ">
                                <div className="row">
                                    <div className="card-title col">
                                        ------------------------------------------
                                    </div>
                                    <div className="card-title col  text-end ">
                                        ------------------------------------------
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="card-title col d-flex align-items-center">
                                        <b>Grand Total :</b>
                                    </div>
                                    <div className="card-title col text-end fs-4 fw-normal">
                                        ₹ {total}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="card-title col d-flex align-items-center">

                                    </div>
                                    <div className="card-title col text-end fs-4 fw-normal">
                                        <button
                                            onClick={() => bookEvent(data.id, total, genquantity, goldquantity, pquantity, fanquantity)}
                                            type="submit"
                                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default SingleCart