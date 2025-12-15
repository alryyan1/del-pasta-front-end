import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { Category, Meal } from "@/Types/types";
import { useCartStore } from "@/stores/useCartStore";
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, TextField, Typography, useMediaQuery, Collapse, Badge } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/system";
import { Plus, Minus, ShoppingCart, UtensilsCrossed, List as ListIcon } from "lucide-react";
import placeholderImg from "@/assets/images/ph.jpg";
import { webUrl } from "@/helpers/constants";

export default function OnlineOrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [delivery, setDelivery] = useState<boolean>(false);
  const [customerState, setCustomerState] = useState<string>("");
  const [customerArea, setCustomerArea] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [orderTime, setOrderTime] = useState<string>("12:00");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  const { items, addItem, updateQuantity, removeItem, totalItems, totalPrice, clear } = useCartStore();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [showCategoryList, setShowCategoryList] = useState<boolean>(true);
  const [cartPulse, setCartPulse] = useState<boolean>(false);
  const [addedMealId, setAddedMealId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    axiosClient.get<Category[]>(`categories`).then(({ data }) => {
      // Filter out categories where is_visible is false
      const visibleCategories = data.filter(category => category.is_visible  == 1);
      setCategories(visibleCategories);
      if (visibleCategories.length > 0) {
        setSelectedCategoryId(isMobile ? null : visibleCategories[0].id);
        setShowCategoryList(true);
      }
    }).finally(() => setLoading(false));
  }, [isMobile]);

  const meals: Meal[] = useMemo(() => {
    const cat = categories.find((c) => c.id === selectedCategoryId);
    return cat?.meals ?? [];
  }, [categories, selectedCategoryId]);

  const [mobileShowMeals, setMobileShowMeals] = useState<boolean>(false);
  if (isMobile) {
    const pink = ['#e91e63', '#d81b60'] as [string,string];
    return (
      <div className="p-3" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 12, position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
            <IconButton color="primary" onClick={() => setMobileShowMeals(false)} aria-label="toggle categories">
              <ListIcon />
            </IconButton>
            {!mobileShowMeals ? (
              <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>del pasta</Typography>
            ) : (
              <Button variant="text" onClick={() => setMobileShowMeals(false)} sx={{ fontWeight: 800, fontSize: '18px', textTransform: 'none' }}>
                {categories.find(c => c.id === selectedCategoryId)?.name}
              </Button>
            )}
            <Stack direction="row" alignItems="center" gap={1}>
              <IconButton color="primary" onClick={() => setCheckoutOpen(true)} aria-label="open cart" sx={{ transform: cartPulse ? 'scale(1.12)' : 'scale(1)', transition: 'transform 200ms' }}>
                <Badge badgeContent={totalItems()} color="primary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Stack>
          </Stack>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: mobileShowMeals ? 'flex-start' : 'space-evenly', gap: mobileShowMeals ? 8 : 0 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </div>
          ) : (
            <Collapse in={!mobileShowMeals} timeout={300} unmountOnExit>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {categories.map((c) => (
                  <Button
                    key={c.id}
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSelectedCategoryId(c.id);
                      setMobileShowMeals(true);
                    }}
                    sx={{
                      height: 64,
                      borderRadius: 3,
                      fontSize: '18px',
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: '0 10px 18px rgba(0,0,0,0.12)',
                      color: '#fff',
                      backgroundImage: `linear-gradient(135deg, ${pink[0]}, ${pink[1]})`,
                      '&:hover': {
                        filter: 'brightness(1.05)',
                        boxShadow: '0 12px 22px rgba(0,0,0,0.16)'
                      }
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UtensilsCrossed size={20} />
                      {c.name}
                    </span>
                  </Button>
                ))}
              </div>
            </Collapse>
          )}
          <Collapse in={mobileShowMeals && selectedCategoryId != null} timeout={300}>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {meals.map((meal) => {
                const cartItem = items.find((it) => it.meal.id === meal.id);
                return (
                  <div key={meal.id} className="p-3 rounded-md shadow bg-white">
                    <Stack gap={1}>
                      <img
                        src={meal.image_url == null ? placeholderImg : `${webUrl}/images/${meal.image_url}`}
                        alt={meal.name}
                        className="w-full h-40 object-cover rounded"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== placeholderImg) {
                            target.onerror = null;
                            target.src = placeholderImg;
                          }
                        }}
                      />
                      <Typography variant="h6" className="text-gray-700">{meal.name}</Typography>
                      <Typography sx={{ fontWeight: 800 }} className="text-gray-700">{meal.price?.toFixed(3)} OMR</Typography>
                      <Stack direction="row" gap={1}>
                        {!cartItem ? (
                          <Button 
                            size="large" 
                            fullWidth 
                            variant="contained" 
                            onClick={() => {
                              setAddedMealId(meal.id);
                              addItem(meal);
                              setCartPulse(true);
                              setTimeout(() => { setAddedMealId(null); setCartPulse(false); }, 220);
                            }}
                            sx={{
                              height: 44,
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: 'none',
                              transform: addedMealId === meal.id ? 'scale(0.98)' : 'scale(1)',
                              transition: 'transform 180ms',
                              backgroundImage: 'linear-gradient(135deg, #f8bbd0, #f48fb1)',
                              '&:hover': { filter: 'brightness(1.05)' }
                            }}
                          >
                            Add to cart
                          </Button>
                        ) : (
                          <Stack direction="row" gap={1} alignItems="center">
                            <IconButton onClick={() => updateQuantity(meal.id, cartItem.quantity - 1)} aria-label="decrease">
                              <Minus />
                            </IconButton>
                            <TextField size="small" value={cartItem.quantity} inputProps={{ readOnly: true, className: "text-center w-12" }} />
                            <IconButton onClick={() => updateQuantity(meal.id, cartItem.quantity + 1)} aria-label="increase">
                              <Plus />
                            </IconButton>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </div>
                );
              })}
            </div>
          </Collapse>
        </div>
        {/* Mobile Checkout Dialog */}
        <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>اكمال الطلب</DialogTitle>
          <DialogContent>
            <Stack gap={2} sx={{ mt: 1 }}>
              <TextField
                label="اسم"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
              />
              <TextField
                label="رقم الهاتف"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                fullWidth
              />
              <FormControlLabel control={<Checkbox checked={delivery} onChange={(e)=> setDelivery(e.target.checked)} />} label="توصيل" />
              {delivery && (
                <>
                  <TextField
                    label="الولاية"
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="المنطقة"
                    value={customerArea}
                    onChange={(e) => setCustomerArea(e.target.value)}
                    fullWidth
                  />
                </>
              )}
              <TextField
                label="تاريخ الطلب"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="وقت الطلب"
                type="time"
                value={orderTime}
                onChange={(e) => setOrderTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="تفاصيل الطلب"
                value={items.map((it) => `${it.meal.name} x ${it.quantity} = ${(it.quantity * (it.meal.price ?? 0)).toFixed(3)} OMR`).join("\n") + (items.length ? `\n—\nالمجموع: ${totalPrice().toFixed(3)} OMR` : "")}
                multiline
                minRows={4}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckoutOpen(false)}>إلغاء</Button>
            <LoadingButton
              variant="contained"
              loading={submitting}
              disabled={submitting || !customerName || !customerPhone || items.length === 0}
              onClick={async () => {
                setSubmitting(true);
                setSubmitMessage("");
                setSubmitSuccess(null);
                try {
                  const payload = {
                    name: customerName,
                    phone: customerPhone,
                    address: delivery ? `${customerState} - ${customerArea}` : '',
                    state: delivery ? customerState : '',
                    area: delivery ? customerArea : '',
                    notes: '',
                    order_date: orderDate || null,
                    order_time: orderTime || null,
                    items: items.map((it) => ({ meal_id: it.meal.id, quantity: it.quantity })),
                  };
                  const res = await axiosClient.post('online-orders/create', payload);
                  clear();
                  
                  // Set order number from response
                  if (res?.data?.data?.order_number) {
                    setOrderNumber(res.data.data.order_number);
                  } else if (res?.data?.data?.id) {
                    setOrderNumber(`#${res.data.data.id}`);
                  }
                  
                  // Show success page
                  setCheckoutOpen(false);
                  setShowSuccessPage(true);
                } catch {
                  setSubmitSuccess(false);
                  setSubmitMessage('تعذر إنشاء الطلب. حاول مرة أخرى');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              اكمال الطلب
            </LoadingButton>
          </DialogActions>
          {submitMessage && (
            <Typography sx={{ px: 3, pb: 2 }} color={submitSuccess ? 'success.main' : 'error.main'}>
              {submitMessage}
            </Typography>
          )}
        </Dialog>

        {/* Success Page */}
        {showSuccessPage && (
          <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الطلب بنجاح!</h2>
                <p className="text-gray-600 mb-4">
                  شكراً لطلبك من Del Pasta. تم استلام طلبك وسيتم التواصل معك قريباً.
                </p>
                {orderNumber && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                    <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                  </div>
                )}
              </div>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  setShowSuccessPage(false);
                  setCheckoutOpen(false);
                  clear();
                  setCustomerName("");
                  setCustomerPhone("");
                  setCustomerState("");
                  setCustomerArea("");
                  setOrderDate(new Date().toISOString().split('T')[0]);
                  setOrderTime("12:00");
                  setDelivery(false);
                }}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '16px',
                  backgroundImage: 'linear-gradient(135deg, #f8bbd0, #f48fb1)',
                  '&:hover': { filter: 'brightness(1.05)' }
                }}
              >
                طلب جديد
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-2">
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        <Stack flex={1} gap={2}>
          <Typography variant="h5">Select Category</Typography>
          <div className={isMobile ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
            {(!isMobile || showCategoryList) && categories.map((c) => (
              <Button key={c.id} fullWidth={isMobile} variant={selectedCategoryId === c.id ? "contained" : "outlined"} onClick={() => { setSelectedCategoryId(c.id); if (isMobile) setShowCategoryList(false); }}>
                {c.name}
              </Button>
            ))}
          </div>

          <Typography variant="h5">Meals</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {meals.map((meal) => {
                const cartItem = items.find((it) => it.meal.id === meal.id);
                return (
                  <div key={meal.id} className="p-3 rounded-md shadow bg-white">
                    <Stack gap={1}>
                      <img
                        src={meal.image_url == null ? placeholderImg : `${webUrl}/images/${meal.image_url}`}
                        alt={meal.name}
                        className="w-full h-40 object-cover rounded"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== placeholderImg) {
                            // prevent infinite loop
                            target.onerror = null;
                            target.src = placeholderImg;
                          }
                        }}
                      />
                      <Typography variant="h6" className="text-gray-700">{meal.name}</Typography>
                      <Typography sx={{ fontWeight: 800 }} className="text-gray-700">{meal.price?.toFixed(3)} OMR</Typography>
                      <Stack direction="row" gap={1}>
                        {!cartItem ? (
                          <Button 
                            size="large" 
                            fullWidth 
                            variant="contained" 
                            onClick={() => {
                              setAddedMealId(meal.id);
                              addItem(meal);
                              setCartPulse(true);
                              setTimeout(() => { setAddedMealId(null); setCartPulse(false); }, 220);
                            }}
                            sx={{
                              height: 44,
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: 'none',
                              transform: addedMealId === meal.id ? 'scale(0.98)' : 'scale(1)',
                              transition: 'transform 180ms',
                              backgroundImage: 'linear-gradient(135deg, #f8bbd0, #f48fb1)',
                              '&:hover': { filter: 'brightness(1.05)' }
                            }}
                          >
                            Add to cart
                          </Button>
                        ) : (
                          <Stack direction="row" gap={1} alignItems="center">
                            <IconButton onClick={() => updateQuantity(meal.id, cartItem.quantity - 1)} aria-label="decrease">
                              <Minus />
                            </IconButton>
                            <TextField size="small" value={cartItem.quantity} inputProps={{ readOnly: true, className: "text-center w-12" }} />
                            <IconButton onClick={() => updateQuantity(meal.id, cartItem.quantity + 1)} aria-label="increase">
                              <Plus />
                            </IconButton>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </div>
                );
              })}
            </div>
          )}
        </Stack>

        <Stack width={{ xs: "100%", md: 360 }} gap={2} className="p-3 rounded-md shadow bg-white h-fit">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Cart</Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <ShoppingCart />
              <Typography>{totalItems()} items</Typography>
            </Stack>
          </Stack>
          <div className="space-y-2">
            {items.length === 0 && <Typography className="text-gray-500">Your cart is empty</Typography>}
            {items.map((it) => (
              <div key={it.meal.id} className="flex items-center justify-between gap-2 border-b pb-2">
                <div className="flex-1">
                  <div className="font-medium">{it.meal.name}</div>
                  <div className="text-sm text-gray-500">{(it.meal.price ?? 0).toFixed(3)} OMR</div>
                </div>
                <Stack direction="row" gap={1} alignItems="center">
                  <IconButton onClick={() => updateQuantity(it.meal.id, it.quantity - 1)} aria-label="dec"><Minus /></IconButton>
                  <span className="w-8 text-center">{it.quantity}</span>
                  <IconButton onClick={() => updateQuantity(it.meal.id, it.quantity + 1)} aria-label="inc"><Plus /></IconButton>
                </Stack>
                <Button color="error" onClick={() => removeItem(it.meal.id)}>Remove</Button>
              </div>
            ))}
          </div>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Total</Typography>
            <Typography>{totalPrice().toFixed(3)} OMR</Typography>
          </Stack>
          <Stack direction="row" gap={1}>
            <Button variant="outlined" fullWidth onClick={clear}>Clear</Button>
            <Button variant="contained" fullWidth disabled={items.length === 0} onClick={() => setCheckoutOpen(true)}>Checkout</Button>
          </Stack>
        </Stack>
      </Stack>

      <Dialog dir open={checkoutOpen} onClose={() => setCheckoutOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>اكمال الطلب</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ mt: 1 ,direction:'rtl' }}>
            <TextField
              label="اسم"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
            />
            <TextField
              label="رقم الهاتف"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              fullWidth
            />
            <FormControlLabel control={<Checkbox checked={delivery} onChange={(e)=> setDelivery(e.target.checked)} />} label="توصيل" />
            {delivery && (
              <>
                <TextField
                  label="الولاية"
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="المنطقة"
                  value={customerArea}
                  onChange={(e) => setCustomerArea(e.target.value)}
                  fullWidth
                />
              </>
            )}
            <TextField
              label="تاريخ الطلب"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="وقت الطلب"
              type="time"
              value={orderTime}
              onChange={(e) => setOrderTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
         
            <TextField
              label="تفاصيل الطلب"
              value={items.map((it) => `${it.meal.name} x ${it.quantity} = ${(it.quantity * (it.meal.price ?? 0)).toFixed(3)} OMR`).join("\n") + (items.length ? `\n—\nالمجموع: ${totalPrice().toFixed(3)} OMR` : "")}
              multiline
              minRows={4}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>إلغاء</Button>
          <LoadingButton
            variant="contained"
            loading={submitting}
            disabled={submitting || !customerName || !customerPhone || items.length === 0}
            onClick={async () => {
              setSubmitting(true);
              setSubmitMessage("");
              setSubmitSuccess(null);
              try {
                const payload = {
                  name: customerName,
                  phone: customerPhone,
                  address: delivery ? `${customerState} - ${customerArea}` : '',
                  state: delivery ? customerState : '',
                  area: delivery ? customerArea : '',
                  notes: '',
                  order_date: orderDate || null,
                  order_time: orderTime || null,
                  items: items.map((it) => ({ meal_id: it.meal.id, quantity: it.quantity })),
                };
                const res = await axiosClient.post('online-orders/create', payload);
                clear();
                
                // Set order number from response
                if (res?.data?.data?.order_number) {
                  setOrderNumber(res.data.data.order_number);
                } else if (res?.data?.data?.id) {
                  setOrderNumber(`#${res.data.data.id}`);
                }
                
                // Show success page
                setCheckoutOpen(false);
                setShowSuccessPage(true);
              } catch {
                setSubmitSuccess(false);
                setSubmitMessage('تعذر إنشاء الطلب. حاول مرة أخرى');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            اكمال الطلب
          </LoadingButton>
        </DialogActions>
        {submitMessage && (
          <Typography sx={{ px: 3, pb: 2 }} color={submitSuccess ? 'success.main' : 'error.main'}>
            {submitMessage}
          </Typography>
        )}
      </Dialog>

      {/* Success Page */}
      {showSuccessPage && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الطلب بنجاح!</h2>
              <p className="text-gray-600 mb-4">
                شكراً لطلبك من Del Pasta. تم استلام طلبك وسيتم التواصل معك قريباً.
              </p>
              {orderNumber && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                  <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                </div>
              )}
            </div>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => {
                setShowSuccessPage(false);
                setCheckoutOpen(false);
                clear();
                setCustomerName("");
                setCustomerPhone("");
                setCustomerState("");
                setCustomerArea("");
                setOrderDate(new Date().toISOString().split('T')[0]);
                setOrderTime("12:00");
                setDelivery(false);
              }}
              sx={{
                height: 48,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '16px',
                backgroundImage: 'linear-gradient(135deg, #f8bbd0, #f48fb1)',
                '&:hover': { filter: 'brightness(1.05)' }
              }}
            >
              طلب جديد
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


