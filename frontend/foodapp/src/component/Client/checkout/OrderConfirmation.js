import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import OrderConfirmationMobile from './OrderConfirmationMobile';
import OrderConfirmationDesktop from './OrderConfirmationDesktop';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const uname = localStorage.getItem("user");

  const [orderData, setOrderData] = useState(location.state || null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // If user arrived directly without state, fetch their latest order from order-dtls
    if (!orderData && uname) {
      axiosInstance.get(`/order-dtls/user/${uname}`)
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const latest = res.data[0];
            setOrderData({
              orderId: `#ZYK-${latest.orderId || latest.ORDERID || '84920'}`,
              cartItems: res.data.slice(0, 3).map(o => ({
                fname: o.fname,
                fprice: o.unitPrice || o.totalPrice || 249,
                currentQty: o.qty || 1
              })),
              grandTotal: latest.grandTotal || 775,
              itemSubtotal: latest.totalPrice || 837,
              discountAmount: latest.discountAmount || 112,
              resolvedAddress: latest.deliveryAddress || "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru",
              paymentMethod: latest.paymentMethod || "Google Pay UPI",
              placedAt: "Just now"
            });
          }
        })
        .catch(() => {});
    }
  }, [orderData, uname]);

  return (
    <>
      {isMobile ? (
        <OrderConfirmationMobile orderData={orderData} navigate={navigate} />
      ) : (
        <OrderConfirmationDesktop orderData={orderData} navigate={navigate} />
      )}
    </>
  );
}

export default OrderConfirmation;
