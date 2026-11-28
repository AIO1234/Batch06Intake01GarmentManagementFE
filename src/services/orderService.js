import axios from "axios";

// Base URL for Laravel backend API (falls back to /api proxy when env var is unset)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Keys used to persist mock/offline master and order data in browser localStorage
const STORAGE_KEYS = {
  ORDERS: "garment_erp_orders",
  STYLES: "garment_erp_garment_styles",
  CUSTOMERS: "garment_erp_customers",
};

// Ordered lifecycle stages for garment orders (used for status flow validation)
export const ORDER_STATUS_FLOW = [
  "Pending",
  "In Production",
  "QA",
  "Dispatched",
  "Completed",
];

// Standard garment size options shown in Garment Style forms
export const GARMENT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Default customer master data used when backend API is unavailable
const DEFAULT_CUSTOMERS = [
  { id: 1, name: "ABC Apparels" },
  { id: 2, name: "Fashion Hub" },
  { id: 3, name: "Urban Wear" },
  { id: 4, name: "Sun Garments" },
];

// Default garment style master data used when backend API is unavailable
const DEFAULT_STYLES = [
  { id: 1, style_name: "Polo Shirt", size: "M", colour: "Blue" },
  { id: 2, style_name: "T-Shirt", size: "L", colour: "White" },
  { id: 3, style_name: "Jogger", size: "S", colour: "Grey" },
  { id: 4, style_name: "Hoodie", size: "XL", colour: "Black" },
];

// Seeded sample orders matching Screen A and Screen B wireframes
const DEFAULT_ORDERS = [
  {
    id: 1,
    order_no: "ORD-2026-0001",
    order_date: "2026-10-01",
    customer_id: 1,
    customer_name: "ABC Apparels",
    garment_style_id: 1,
    style_label: "Polo Shirt M Blue",
    quantity: 100,
    unit_price: 1450.0,
    delivery_date: "2026-11-15",
    status: "QA",
  },
  {
    id: 2,
    order_no: "ORD-2026-0002",
    order_date: "2026-10-03",
    customer_id: 2,
    customer_name: "Fashion Hub",
    garment_style_id: 2,
    style_label: "T-Shirt L White",
    quantity: 250,
    unit_price: 980.0,
    delivery_date: "2026-11-30",
    status: "In Production",
  },
  {
    id: 3,
    order_no: "ORD-2026-0003",
    order_date: "2026-10-10",
    customer_id: 3,
    customer_name: "Urban Wear",
    garment_style_id: 3,
    style_label: "Jogger S Grey",
    quantity: 80,
    unit_price: 2100.0,
    delivery_date: "2026-12-05",
    status: "Pending",
  },
  {
    id: 4,
    order_no: "ORD-2026-0000",
    order_date: "2026-09-20",
    customer_id: 1,
    customer_name: "ABC Apparels",
    garment_style_id: 1,
    style_label: "Polo Shirt M Blue",
    quantity: 60,
    unit_price: 1400.0,
    delivery_date: "2026-10-15",
    status: "Completed",
  },
];

/**
 * Read a JSON array from localStorage, seeding it with fallback data if empty.
 */
function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return JSON.parse(JSON.stringify(fallback));
    }
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(fallback));
  }
}

/**
 * Persist updated records into localStorage for offline/demo usage.
 */
function writeLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

/**
 * Build a readable label from a garment style record (e.g. "Polo Shirt M Blue").
 */
export function formatStyleLabel(style) {
  if (!style) return "";
  return `${style.style_name} ${style.size} ${style.colour}`.trim();
}

/**
 * Generate the next sequential order number in ORD-YYYY-XXXX format.
 */
export function generateNextOrderNo(orders) {
  const year = new Date().getFullYear();
  const maxSeq = (orders || []).reduce((max, order) => {
    const match = String(order.order_no || "").match(/(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  return `ORD-${year}-${String(maxSeq + 1).padStart(4, "0")}`;
}

/**
 * Return background and text colors for colour-coded order status badges.
 */
export function getStatusColor(status) {
  const map = {
    Pending: { bg: "#e2e8f0", text: "#334155" },
    "In Production": { bg: "#dbeafe", text: "#1d4ed8" },
    QA: { bg: "#ffedd5", text: "#c2410c" },
    Dispatched: { bg: "#ede9fe", text: "#6d28d9" },
    Completed: { bg: "#dcfce7", text: "#15803d" },
  };
  return map[status] || { bg: "#f1f5f9", text: "#475569" };
}

export default {
  /**
   * Fetch all customers from API (or local fallback) for order dropdowns and filters.
   */
  async getCustomers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback to seeded localStorage data when backend API is unavailable
    }
    return readLocal(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  },

  /**
   * Fetch all garment styles from master data.
   */
  async getGarmentStyles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/garment-styles`);
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback to seeded localStorage data when backend API is unavailable
    }
    return readLocal(STORAGE_KEYS.STYLES, DEFAULT_STYLES);
  },

  /**
   * Create a new garment style record.
   */
  async createGarmentStyle(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/garment-styles`, payload);
      return response.data?.data ?? response.data;
    } catch {
      const styles = readLocal(STORAGE_KEYS.STYLES, DEFAULT_STYLES);
      const nextId =
        styles.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
      const newStyle = {
        id: nextId,
        style_name: payload.style_name.trim(),
        size: payload.size,
        colour: payload.colour.trim(),
      };
      styles.unshift(newStyle);
      writeLocal(STORAGE_KEYS.STYLES, styles);
      return newStyle;
    }
  },

  /**
   * Update an existing garment style by ID.
   */
  async updateGarmentStyle(id, payload) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/garment-styles/${id}`,
        payload
      );
      return response.data?.data ?? response.data;
    } catch {
      const styles = readLocal(STORAGE_KEYS.STYLES, DEFAULT_STYLES);
      const idx = styles.findIndex((item) => item.id === id);
      if (idx !== -1) {
        styles[idx] = {
          ...styles[idx],
          style_name: payload.style_name.trim(),
          size: payload.size,
          colour: payload.colour.trim(),
        };
        writeLocal(STORAGE_KEYS.STYLES, styles);
        return styles[idx];
      }
      return null;
    }
  },

  /**
   * Delete a garment style by ID.
   */
  async deleteGarmentStyle(id) {
    try {
      await axios.delete(`${API_BASE_URL}/garment-styles/${id}`);
      return true;
    } catch {
      const styles = readLocal(STORAGE_KEYS.STYLES, DEFAULT_STYLES);
      const filtered = styles.filter((item) => item.id !== id);
      writeLocal(STORAGE_KEYS.STYLES, filtered);
      return true;
    }
  },

  /**
   * Fetch all orders for the Orders management table.
   */
  async getAllOrders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback to seeded localStorage data when backend API is unavailable
    }
    return readLocal(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  },

  /**
   * Create a new order and resolve its customer/style display labels.
   */
  async createOrder(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, payload);
      return response.data?.data ?? response.data;
    } catch {
      const orders = readLocal(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      const customers = readLocal(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
      const styles = readLocal(STORAGE_KEYS.STYLES, DEFAULT_STYLES);

      const nextId =
        orders.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
      const customer = customers.find((c) => c.id === payload.customer_id);
      const style = styles.find((s) => s.id === payload.garment_style_id);

      const newOrder = {
        id: nextId,
        order_no: payload.order_no || generateNextOrderNo(orders),
        order_date: payload.order_date,
        customer_id: payload.customer_id,
        customer_name: customer ? customer.name : payload.customer_name || "",
        garment_style_id: payload.garment_style_id,
        style_label: style ? formatStyleLabel(style) : payload.style_label || "",
        quantity: Number(payload.quantity),
        unit_price: Number(payload.unit_price),
        delivery_date: payload.delivery_date,
        status: payload.status || "Pending",
      };

      orders.unshift(newOrder);
      writeLocal(STORAGE_KEYS.ORDERS, orders);
      return newOrder;
    }
  },

  /**
   * Update an existing order (details and status workflow) by ID.
   */
  async updateOrder(id, payload) {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}`, payload);
      return response.data?.data ?? response.data;
    } catch {
      const orders = readLocal(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      const customers = readLocal(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
      const styles = readLocal(STORAGE_KEYS.STYLES, DEFAULT_STYLES);

      const idx = orders.findIndex((item) => item.id === id);
      if (idx !== -1) {
        const customer = customers.find((c) => c.id === payload.customer_id);
        const style = styles.find((s) => s.id === payload.garment_style_id);
        orders[idx] = {
          ...orders[idx],
          order_date: payload.order_date,
          customer_id: payload.customer_id,
          customer_name: customer
            ? customer.name
            : orders[idx].customer_name,
          garment_style_id: payload.garment_style_id,
          style_label: style
            ? formatStyleLabel(style)
            : orders[idx].style_label,
          quantity: Number(payload.quantity),
          unit_price: Number(payload.unit_price),
          delivery_date: payload.delivery_date,
          status: payload.status,
        };
        writeLocal(STORAGE_KEYS.ORDERS, orders);
        return orders[idx];
      }
      return null;
    }
  },

  /**
   * Delete an order by ID.
   */
  async deleteOrder(id) {
    try {
      await axios.delete(`${API_BASE_URL}/orders/${id}`);
      return true;
    } catch {
      const orders = readLocal(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      const filtered = orders.filter((item) => item.id !== id);
      writeLocal(STORAGE_KEYS.ORDERS, filtered);
      return true;
    }
  },

  /**
   * Fetch filtered order rows for Screen B (Order Status Report).
   */
  async getOrderStatusReport(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/order-status`, {
        params: filters,
      });
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback to local filter when backend API is unavailable
    }
    let orders = readLocal(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    if (filters.customer_id && filters.customer_id !== "all") {
      orders = orders.filter((o) => o.customer_id === filters.customer_id);
    }
    if (filters.status && filters.status !== "All") {
      orders = orders.filter((o) => o.status === filters.status);
    }
    return orders;
  },
};
