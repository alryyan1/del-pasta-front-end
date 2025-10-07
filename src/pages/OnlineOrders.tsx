import { useEffect, useMemo, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import { ArrowDown, ArrowUp, Printer, MessageCircle } from "lucide-react";
import { webUrl } from "@/helpers/constants";

interface OnlineOrderItem {
  id: number;
  name: string;
  phone: string;
  address?: string;
  area?: string;
  state?: string;
  items: { meal: { name: string; price?: number }; quantity: number }[];
  total?: number;
  created_at?: string;
  status?: string;
}

export default function OnlineOrders() {
  const [orders, setOrders] = useState<OnlineOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<OnlineOrderItem | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [serverTotalPages, setServerTotalPages] = useState<number | null>(null);
  const [stateFilter, setStateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [perPage, setPerPage] = useState<number>(10);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const mapApiToItem = (o: any): OnlineOrderItem => ({
    id: o.id,
    name: o.customer_name ?? o.name ?? '',
    phone: o.customer_phone ?? o.phone ?? '',
    address: o.customer_address ?? o.address ?? '',
    area: o.area ?? '',
    state: o.state ?? '',
    items: Array.isArray(o.items)
      ? o.items.map((it: any) => ({
          meal: { name: it?.meal?.name ?? '', price: it?.meal?.price },
          quantity: it?.quantity ?? 0,
        }))
      : [],
    total: o.total_price != null ? Number(o.total_price) : o.total,
    created_at: o.created_at,
    status: o.status,
  });

  const fetchPage = async (p: number) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get<any>(`online-orders`, { params: { page: p, search, state: stateFilter, area: areaFilter, per_page: perPage, sort: sortDesc ? 'desc' : 'asc' } });
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const mapped = list.map(mapApiToItem);
      setOrders(mapped);
      setServerTotalPages(typeof data?.last_page === 'number' ? data.last_page : null);
      setPage(typeof data?.current_page === 'number' ? data.current_page : p);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, stateFilter, areaFilter, perPage, sortDesc]);

  const filteredSorted = useMemo(() => {
    const base: OnlineOrderItem[] = Array.isArray(orders) ? orders : [];
    const q = search.trim().toLowerCase();
    let list = base.filter((o) =>
      !q ||
      o.name?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q) ||
      o.address?.toLowerCase().includes(q) ||
      o.items?.some((it) => it.meal.name.toLowerCase().includes(q))
    );
    list = list.sort((a, b) => {
      const da = new Date(a.created_at ?? 0).getTime();
      const db = new Date(b.created_at ?? 0).getTime();
      return sortDesc ? db - da : da - db;
    });
    return list;
  }, [orders, search, sortDesc]);

  const totalPages = serverTotalPages ?? Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const pageItems = serverTotalPages ? orders : filteredSorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Stack gap={2}>
      <Typography variant="h5">Online Orders</Typography>
      <Stack direction={{ xs: "column", md: "row" }} gap={1} alignItems={{ md: "center" }}>
        <TextField size="small" placeholder="Search... (name/phone/address/item)" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <TextField size="small" placeholder="State" value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(1); }} />
        <TextField size="small" placeholder="Area" value={areaFilter} onChange={(e) => { setAreaFilter(e.target.value); setPage(1); }} />
        <TextField
          size="small"
          select
          SelectProps={{ native: true }}
          label="Rows"
          value={perPage}
          onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
        >
          {[10, 50, 200, 500].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </TextField>
        <Button variant="text" onClick={() => setSortDesc((v) => !v)} startIcon={sortDesc ? <ArrowDown /> : <ArrowUp />}>Sort {sortDesc ? "DESC" : "ASC"}</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>WhatsApp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageItems.map((o) => (
              <TableRow
                key={o.id}
                hover
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 
                    highlightId === o.id || selected?.id === o.id 
                      ? 'rgba(156, 39, 176, 0.08)' 
                      : o.status === 'confirmed' 
                        ? 'rgba(76, 175, 80, 0.1)' 
                        : undefined,
                  transition: 'background-color 200ms ease-in-out',
                }}
                onClick={() => setSelected(o)}
              >
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.name}</TableCell>
                <TableCell>{o.phone}</TableCell>
                <TableCell>{o.area}</TableCell>
                <TableCell>{o.state}</TableCell>
                <TableCell>{o.items?.map((it) => `${it.meal.name} x ${it.quantity}`).join(', ')}</TableCell>
                <TableCell>{o.total?.toFixed?.(3)}</TableCell>
                <TableCell>{o.created_at ? new Date(o.created_at).toLocaleString() : ''}</TableCell>
                <TableCell>{o.status ?? '-'}</TableCell>
                <TableCell>
                  <IconButton aria-label="view invoice" onClick={(e) => {
                    e.stopPropagation();
                    // Prefer web route to avoid CORS
                    const url = `${webUrl}online-orders/${o.id}/invoice`;
                    window.open(url, '_blank');
                  }}>
                    <Printer size={18} />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="send whatsapp" onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      setSendingId(o.id);
                      await axiosClient.post(`online-orders/${o.id}/invoice/send`);
                      setSnackSeverity("success");
                      setSnackMsg("Invoice sent via WhatsApp.");
                      setSnackOpen(true);
                    } catch (err) {
                      setSnackSeverity("error");
                      setSnackMsg("Failed to send invoice.");
                      setSnackOpen(true);
                    } finally {
                      setSendingId(null);
                    }
                  }} disabled={sendingId === o.id}>
                    {sendingId === o.id ? (
                      <CircularProgress size={18} />
                    ) : (
                      <MessageCircle size={18} color="#25D366" />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center">
        <Pagination page={page} count={totalPages} onChange={(_, p) => { serverTotalPages ? fetchPage(p) : setPage(p); }} />
      </Stack>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Order #{selected?.id}</DialogTitle>
        <DialogContent>
          <Stack gap={1}>
            <Typography><b>Name:</b> {selected?.name}</Typography>
            <Typography><b>Phone:</b> {selected?.phone}</Typography>
            {selected?.address && <Typography><b>Address:</b> {selected.address}</Typography>}
            <Typography><b>Items:</b></Typography>
            <ul style={{ marginTop: 0 }}>
              {selected?.items?.map((it, idx) => (
                <li key={idx}>{it.meal.name} x {it.quantity} {it.meal.price ? `= ${(it.quantity * (it.meal.price ?? 0)).toFixed(3)} OMR` : ''}</li>
              ))}
            </ul>
            {selected?.total != null && <Typography><b>Total:</b> {selected.total.toFixed(3)} OMR</Typography>}
            {selected?.created_at && <Typography><b>Created:</b> {new Date(selected.created_at).toLocaleString()}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button variant="contained" disabled={confirming} onClick={async () => {
            if (!selected) return;
            try {
              setConfirming(true);
              setHighlightId(selected.id);
              await axiosClient.post(`online-orders/${selected.id}/confirm`);
              setSelected(null);
              if (serverTotalPages) {
                await fetchPage(page);
              } else {
                // refresh client list
                fetchPage(1);
              }
            } finally {
              setConfirming(false);
              setTimeout(() => setHighlightId(null), 1200);
            }
          }}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={2500} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackSeverity} variant="filled" sx={{ width: '100%' }} onClose={() => setSnackOpen(false)}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}


