import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import OrderTrackingMobile from './OrderTrackingMobile';
import OrderTrackingDesktop from './OrderTrackingDesktop';

function OrderTracking() {
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
    if (!orderData && uname) {
      axiosInstance.get(`/order-dtls/user/${uname}`)
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const latest = res.data[0];
            setOrderData({
              orderId: `#ZYK-${latest.orderId || latest.ORDERID || '883921'}`,
              grandTotal: latest.grandTotal || 775,
              resolvedAddress: latest.deliveryAddress || "Penthouse 402, Casa Botanica, 12th Main Road, Indiranagar"
            });
          }
        })
        .catch(() => {});
    }
  }, [orderData, uname]);

  return (
    <>
      {isMobile ? (
        <OrderTrackingMobile orderData={orderData} navigate={navigate} />
      ) : (
        <OrderTrackingDesktop orderData={orderData} navigate={navigate} />
      )}
    </>
  );
}

export default OrderTracking;
