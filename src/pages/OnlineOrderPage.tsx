import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { Category, Meal } from "@/Types/types";
import { useCartStore } from "@/stores/useCartStore";
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/system";
import { Plus, Minus, ShoppingCart } from "lucide-react";
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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const { items, addItem, updateQuantity, removeItem, totalItems, totalPrice, clear } = useCartStore();

  useEffect(() => {
    setLoading(true);
    axiosClient.get<Category[]>(`categories`).then(({ data }) => {
      setCategories(data);
      if (data.length > 0) setSelectedCategoryId(data[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const meals: Meal[] = useMemo(() => {
    const cat = categories.find((c) => c.id === selectedCategoryId);
    return cat?.meals ?? [];
  }, [categories, selectedCategoryId]);

  return (
    <div className="p-2">
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        <Stack flex={1} gap={2}>
          <Typography variant="h5">Select Category</Typography>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Button key={c.id} variant={selectedCategoryId === c.id ? "contained" : "outlined"} onClick={() => setSelectedCategoryId(c.id)}>
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
                      <Typography className="text-gray-500">{meal.price?.toFixed(3)} OMR</Typography>
                      <Stack direction="row" gap={1}>
                        {!cartItem ? (
                          <Button size="small" variant="contained" onClick={() => addItem(meal)}>
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
                  items: items.map((it) => ({ meal_id: it.meal.id, quantity: it.quantity })),
                };
                const res = await axiosClient.post('online-orders/create', payload);
                clear();
                // Try to read whatsapp send result if backend provides it
                const wa = res?.data?.wa_sent ?? res?.data?.whatsapp_sent ?? res?.data?.whatsapp ?? null;
                if (wa === true) {
                  setSubmitSuccess(true);
                  setSubmitMessage('تم إنشاء الطلب وإرسال رسالة الواتساب بنجاح');
                } else if (wa === false) {
                  setSubmitSuccess(false);
                  setSubmitMessage('تم إنشاء الطلب ولكن تعذر إرسال رسالة الواتساب');
                } else {
                  setSubmitSuccess(true);
                  setSubmitMessage('تم إنشاء الطلب');
                }
                // Optionally close dialog after short delay
                setTimeout(() => {
                  setCheckoutOpen(false);
                  setSubmitMessage("");
                  setSubmitSuccess(null);
                }, 1200);
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
    </div>
  );
}


