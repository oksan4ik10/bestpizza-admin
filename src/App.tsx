
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";

import OrdersPage from "./pages/Orders/OrdersPageMain/OrdersPage";
import ProductsPage from "./pages/Products/ProductsPageMain/ProductsPage";

import ErrorPages from "./pages/Error/ErrorPages";

import { LoginPage } from "./pages/Login/LoginPage";


import OrdersShowEdit from "./pages/Orders/OrdersShowEdit/OrdersShowEdit";


import ProductsShowEdit from "./pages/Products/ProductsShowEdit/ProductsShowEdit";
import ProductsCreate from "./pages/Products/ProductsCreate/ProductsCreate";

import { RequireAuth } from "./hoc/RequireAuth";

import LayoutMenu from "./components/Layout/Layout";
import 'overlayscrollbars/overlayscrollbars.css';
import './App.css'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<LayoutMenu />}>
      <Route path="products" element={<RequireAuth><ProductsPage /></RequireAuth>}></Route>
      <Route path="products/:id" element={<RequireAuth><ProductsShowEdit edit={false} nameFunc="show" /></RequireAuth>}></Route>
      <Route path="products/create" element={<RequireAuth><ProductsCreate edit={true} /></RequireAuth>}></Route>
      <Route path="products/edit/:id" element={<RequireAuth><ProductsShowEdit edit={true} nameFunc="save" /></RequireAuth>}></Route>

      <Route index element={<RequireAuth><OrdersPage /></RequireAuth>}></Route>
      <Route path="orders" element={<RequireAuth><OrdersPage /></RequireAuth>}></Route>
      <Route path="orders/:id" element={<RequireAuth><OrdersShowEdit edit={false} nameFunc="show" /></RequireAuth>}></Route>
      <Route path="orders/edit/:id" element={<RequireAuth><OrdersShowEdit edit={true} nameFunc="save" /></RequireAuth>}></Route>

      <Route path="login" element={<LoginPage></LoginPage>}></Route>

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
