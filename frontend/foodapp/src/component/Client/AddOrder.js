import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CartMobile from './cart/CartMobile';
import CartDesktop from './cart/CartDesktop';

function AddOrder() {
  const navigate = useNavigate();
  const currentUserName = localStorage.getItem("user");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Responsive Breakpoint check matching 1024px standard
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("BOTANICAL50");
  const [discountAmount, setDiscountAmount] = useState(120);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user's cart items from the database
  const fetchCart = () => {
    if (currentUserName) {
      axiosInstance.get(`/orders/user/details/${currentUserName}`)
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const initializedCart = res.data.map(item => ({
              ...item,
              currentQty: Number(item.qty || item.QTY) || 1
            }));
            setCartItems(initializedCart);
          } else {
            // Default sample items if user's DB cart is empty so the rich mockups can be explored
            setCartItems([
              {
                oid: 'demo-1',
                fid: '1',
                fname: 'Artisanal Pepperoni Pizza',
                subtext: 'Medium • Stuffed Crust Cheese Burst',
                fprice: 399,
                currentQty: 1,
                image: 'https://lh3.googleusercontent.com/aida/AEtjO1Xjjm4_ZVVqauAS7mcQM4PLiAulZzogk040b5i_Un70iDimkklimkLWu2Y54_4Xc8irxT8jOH3zqAzXsbOvxer0qNLtCIsbku-fOIZtVTpdDAaZUd9aRtkGr4cA_hBjeYA0zQLJEZNIYCR7q8rWRWtrMWtDsBgoMW4xci-mT13yiUxFkSE0JwoNUvZfj2vo8ie4TEWzouUqWZFBmokJUtEpL3Z2HUjlrcM7lXVXF_T9qS7Hu1Y1_rYIq6I',
                isVeg: false
              },
              {
                oid: 'demo-2',
                fid: '2',
                fname: 'Smoky BBQ Burger',
                subtext: 'Woodfired Brioche • Double Glaze',
                fprice: 249,
                currentQty: 1,
                image: 'https://lh3.googleusercontent.com/aida/AEtjO1V-_y0s5klUGPhsCnJZt6llTDZKMvMDxxgR5S4TexJFNrzpEb4BGJF6pdIyw_KwqdEB96-dUJUP0Ph6CoGfqSPp7dUfetEXE6VGPuY5H0bC_g_2B1Bs07RE3mjDZwO0HzRCTaQBVOxKYw47UsrUHfJ6GaztY75KRwcUeZQHg0l0IrX2jCB_MmsdeVZOmpMg70l_SKSSJVh6LQnDkvldVlOpDXGl-UA1KeLRnp1tT_YedPk883C-xHC0IAk',
                isVeg: false
              },
              {
                oid: 'demo-3',
                fid: '3',
                fname: 'Belgian Dark Lava Cake',
                subtext: 'Warm Molten • Wild Berries',
                fprice: 189,
                currentQty: 1,
                image: 'https://lh3.googleusercontent.com/aida/AEtjO1VCl1Tj2rbSwfnrLsN0BocsQ9nCNJnxrTojifnqdTZlmy5tSV6nkay8e1zpe-UsZM4Sw_n-OlzD-UohGbL615NA-dKfPDo6FjQH9lBHvl-cBmxOQS3jv1mHP-62sBN68mpo21tdcpXC6BDtMNQZWCm9220dAfDCnCoDJkoVUbsO_eVoQQ8gQd1Alc_gqJGEu1Lx1fTD1eERU9R7NF1m0_fxW_cNfRzbNoi5G7qIngE3zwBbl0zn0UNqFCc',
                isVeg: true
              }
            ]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching cart data:", err);
          // Fallback to sample items for demo
          setCartItems([
            {
              oid: 'demo-1',
              fid: '1',
              fname: 'Artisanal Pepperoni Pizza',
              subtext: 'Medium • Stuffed Crust Cheese Burst',
              fprice: 399,
              currentQty: 1,
              isVeg: false
            },
            {
              oid: 'demo-2',
              fid: '2',
              fname: 'Smoky BBQ Burger',
              subtext: 'Woodfired Brioche • Double Glaze',
              fprice: 249,
              currentQty: 1,
              isVeg: false
            },
            {
              oid: 'demo-3',
              fid: '3',
              fname: 'Belgian Dark Lava Cake',
              subtext: 'Warm Molten • Wild Berries',
              fprice: 189,
              currentQty: 1,
              isVeg: true
            }
          ]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserName]);

  // Handle Quantity Changes locally and on DB
  const handleQtyChange = (index, delta) => {
    const updatedCart = [...cartItems];
    const newQty = updatedCart[index].currentQty + delta;
    if (newQty > 0) {
      updatedCart[index].currentQty = newQty;
      setCartItems(updatedCart);
      const oid = updatedCart[index].oid || updatedCart[index].OID;
      if (oid && !String(oid).startsWith('demo')) {
        axiosInstance.put(`/orders/update/${oid}/${newQty}`).catch(() => {});
      }
    } else {
      handleRemoveItem(index, updatedCart[index].oid || updatedCart[index].OID);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (index, oid) => {
    if (oid && !String(oid).startsWith('demo')) {
      try {
        await axiosInstance.delete(`/orders/delete/${oid}`);
        toast.success("Item removed from tray");
      } catch (e) {
        console.error("Error deleting item:", e);
      }
    }
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  // Add Sommelier Upsell Item to Tray
  const handleAddPairing = async (pairingItem) => {
    if (currentUserName) {
      try {
        await axiosInstance.post('/orders/add', {
          fid: pairingItem.fid,
          fname: pairingItem.fname,
          qty: 1,
          uname: currentUserName
        });
        toast.success(`Added ${pairingItem.fname} to tray! 🍷`);
        fetchCart();
      } catch {
        setCartItems(prev => [...prev, pairingItem]);
        toast.success(`Added ${pairingItem.fname} to tray! 🍷`);
      }
    } else {
      setCartItems(prev => [...prev, pairingItem]);
      toast.success(`Added ${pairingItem.fname} to tray! 🍷`);
    }
  };

  // Dynamic calculations
  const itemSubtotal = cartItems.reduce((sum, item) => {
    const unitPrice = Number(item.fprice || item.FPRICE || item.price || 0);
    return sum + (unitPrice * (item.currentQty || 1));
  }, 0);

  const packagingFee = itemSubtotal > 0 ? 58 : 0;
  const deliveryFee = 0; // Complimentary

  // Handle Coupon Logic
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a voucher code.");
      return;
    }
    if (code === "BOTANICAL50" || code === "SWIGGY50") {
      const disc = Math.min(120, Math.round(itemSubtotal * 0.5));
      setDiscountAmount(disc || 120);
      setAppliedCoupon(code);
      toast.success(`Voucher ${code} applied! ₹${disc || 120} saved 🌿`);
    } else {
      setDiscountAmount(50);
      setAppliedCoupon(code);
      toast.success(`Voucher ${code} applied! ₹50 saved 🌿`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    toast("Voucher removed");
  };

  const grandTotal = Math.max(0, itemSubtotal + packagingFee + deliveryFee - (appliedCoupon ? discountAmount : 0));

  // Sync quantities to DB and navigate to Checkout
  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your tray is empty!");
      return;
    }

    if (currentUserName) {
      try {
        await Promise.all(
          cartItems.filter(item => item.oid && !String(item.oid).startsWith('demo')).map(item =>
            axiosInstance.put(`/orders/update/${item.oid || item.OID}/${item.currentQty}`)
          )
        );
      } catch (error) {
        console.error("Cart sync warning", error);
      }
    }

    navigate("/billing");
  };

  const sharedProps = {
    cartItems,
    onUpdateQty: handleQtyChange,
    onRemoveItem: handleRemoveItem,
    appliedCoupon,
    couponInput,
    setCouponInput,
    onApplyCoupon: handleApplyCoupon,
    onRemoveCoupon: handleRemoveCoupon,
    discountAmount,
    itemSubtotal,
    packagingFee,
    deliveryFee,
    grandTotal,
    onProceedToCheckout: handleProceedToCheckout,
    onAddPairing: handleAddPairing,
    navigate
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label-sm uppercase tracking-wider text-charcoal-ink">Gathering Sanctuary Tray...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <CartMobile {...sharedProps} />
      ) : (
        <CartDesktop {...sharedProps} />
      )}
    </>
  );
}

export default AddOrder;