import { NavLink, Outlet, useLocation } from "react-router-dom"
import "./Layout.css";
import { useAppSelector } from "../../store/store";
import urlLogo from "../../assets/images/logo.png";
function LayoutMenu() {
    const isAuth = useAppSelector((store) => store.userReducer).isAuth;
    const location = useLocation();
    if (location.pathname === "/login" || !isAuth) return <Outlet />
    return (
        <>
            <div className="container">

                <nav className="nav">
                    <NavLink to="/" className="logo">
                        <img src={urlLogo} alt="logo" />
                        BestPizza
                    </NavLink>

                    <NavLink to="/products" className="nav__link nav__products">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M10.5 0L21 4.66916V16.3421L10.5 21L0 16.3421V4.66916L10.5 0ZM18.3876 5.11812L10.5 1.61625L7.45853 2.96312L15.2957 6.48744L18.3876 5.11812ZM10.5 8.61999L13.5036 7.29556L5.65385 3.77125L2.61238 5.11812L10.5 8.61999ZM1.61538 6.28541V15.4441L9.69231 19.0358V9.87707L1.61538 6.28541ZM11.3077 19.0358L19.3846 15.4441V6.28541L11.3077 9.87707V19.0358Z" fill="#7D7D7D" />
                        </svg>
                        Товары
                    </NavLink>
                    <NavLink to="/" className="nav__link nav__orders">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
                            <path d="M21.351 9.58L11.451 0.580001C11.0385 0.20808 10.481 -0.000420824 9.9 6.37713e-07H2.2C1.61652 6.37713e-07 1.05695 0.210714 0.644366 0.585787C0.231786 0.96086 6.90723e-07 1.46957 6.90723e-07 2V9C-0.000229341 9.26391 0.0569984 9.52526 0.168385 9.76897C0.279772 10.0127 0.443115 10.2339 0.649001 10.42L10.549 19.42C10.9615 19.7919 11.519 20.0004 12.1 20C12.6825 19.9978 13.2403 19.7856 13.651 19.41L21.351 12.41C21.7641 12.0366 21.9975 11.5296 22 11C22.0002 10.7361 21.943 10.4747 21.8316 10.231C21.7202 9.98732 21.5569 9.76606 21.351 9.58ZM12.1 18L2.2 9V2H9.9L19.8 11M4.95 3C5.27634 3 5.59535 3.08797 5.86669 3.2528C6.13803 3.41762 6.34952 3.65189 6.4744 3.92598C6.59929 4.20006 6.63196 4.50166 6.5683 4.79264C6.50463 5.08361 6.34748 5.35088 6.11673 5.56066C5.88597 5.77044 5.59197 5.9133 5.2719 5.97118C4.95183 6.02906 4.62007 5.99935 4.31857 5.88582C4.01707 5.77229 3.75938 5.58003 3.57808 5.33336C3.39677 5.08668 3.3 4.79667 3.3 4.5C3.3 4.10218 3.47384 3.72064 3.78327 3.43934C4.09271 3.15804 4.51239 3 4.95 3Z" />
                        </svg>
                        Заказы</NavLink>
                </nav>
                <main className="main">
                    <Outlet></Outlet>
                </main>
            </div>



        </>
    )
}

export default LayoutMenu