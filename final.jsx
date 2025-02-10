import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import "./index.css"; 

// ===============================
// REDUX - Manejo del Carrito
// ===============================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    totalItems: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total += action.payload.price;
      state.totalItems += 1;
    },
    incrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      item.quantity++;
      state.total += item.price;
      state.totalItems++;
    },
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item.quantity > 1) {
        item.quantity--;
        state.total -= item.price;
        state.totalItems--;
      }
    },
    removeItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      state.total -= item.price * item.quantity;
      state.totalItems -= item.quantity;
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
const { addToCart, incrementItem, decrementItem, removeItem } = cartSlice.actions;

// ===============================
// COMPONENTE: Encabezado
// ===============================
const Header = () => {
  const cartCount = useSelector((state) => state.cart.totalItems);
  return (
    <nav>
      <Link to="/">Inicio</Link> | 
      <Link to="/productos"> Productos</Link> | 
      <Link to="/carrito"> 🛒 ({cartCount})</Link>
    </nav>
  );
};

// ===============================
// COMPONENTE: Página de Inicio
// ===============================
const Home = () => (
  <div className="home">
    <h1>🌱 GreenLife - Tu Tienda de Plantas</h1>
    <p>Las mejores plantas para tu hogar, directamente a tu puerta.</p>
    <Link to="/productos">
      <button>Comenzar</button>
    </Link>
  </div>
);

// ===============================
// COMPONENTE: Listado de Productos
// ===============================
const products = [
  { id: 1, name: "Monstera", price: 15, image: "https://via.placeholder.com/100" },
  { id: 2, name: "Cactus", price: 10, image: "https://via.placeholder.com/100" },
  { id: 3, name: "Pothos", price: 12, image: "https://via.placeholder.com/100" },
  { id: 4, name: "Suculenta", price: 8, image: "https://via.placeholder.com/100" },
  { id: 5, name: "Bambú", price: 20, image: "https://via.placeholder.com/100" },
  { id: 6, name: "Orquídea", price: 25, image: "https://via.placeholder.com/100" },
];

const ProductList = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Lista de Plantas</h2>
      {products.map((plant) => (
        <div key={plant.id} className="product">
          <img src={plant.image} alt={plant.name} width="100" />
          <h3>{plant.name}</h3>
          <p>${plant.price}</p>
          <button onClick={() => dispatch(addToCart(plant))}>Añadir a la cesta</button>
        </div>
      ))}
    </div>
  );
};

// ===============================
// COMPONENTE: Carrito de Compras
// ===============================
const Cart = () => {
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <p>Total: ${total}</p>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} width="50" />
          <h3>{item.name}</h3>
          <p>${item.price} x {item.quantity}</p>
          <button onClick={() => dispatch(incrementItem(item.id))}>+</button>
          <button onClick={() => dispatch(decrementItem(item.id))} disabled={item.quantity <= 1}>-</button>
          <button onClick={() => dispatch(removeItem(item.id))}>❌</button>
        </div>
      ))}

      <button>Próximamente</button>
      <Link to="/productos">
        <button>Continuar Comprando</button>
      </Link>
    </div>
  );
};
