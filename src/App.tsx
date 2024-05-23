
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";

import OrdersPage from "./pages/Orders/OrdersPageMain/OrdersPage";
import ProductsPage from "./pages/Products/ProductsPageMain/ProductsPage";

import ErrorPages from "./pages/Error/ErrorPages";


import OrdersShowEdit from "./pages/Orders/OrdersShowEdit/OrdersShowEdit";


import ProductsShowEdit from "./pages/Products/ProductsShowEdit/ProductsShowEdit";
import ProductsCreate from "./pages/Products/ProductsCreate/ProductsCreate";

import LayoutMenu from "./components/Layout/Layout";
import 'overlayscrollbars/overlayscrollbars.css';
import './App.css'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<LayoutMenu />}>
      <Route path="products" element={<ProductsPage />}></Route>
      <Route path="products/:id" element={<ProductsShowEdit edit={false} nameFunc="show" />}></Route>
      <Route path="products/create" element={<ProductsCreate edit={true} />}></Route>
      <Route path="products/edit/:id" element={<ProductsShowEdit edit={true} nameFunc="save" />}></Route>

      <Route index element={<OrdersPage />}></Route>
      <Route path="orders/:id" element={<OrdersShowEdit edit={false} nameFunc="show" />}></Route>
      <Route path="orders/edit/:id" element={<OrdersShowEdit edit={true} nameFunc="save" />}></Route>

      <Route path="*" element={<ErrorPages />}></Route>
    </Route>
  )
)

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
