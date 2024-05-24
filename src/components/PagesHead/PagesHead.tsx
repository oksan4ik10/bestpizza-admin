import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { resetUser } from "../../store/reducers/userReducer";


import "./PagesHead.css"

interface IProps {
    title: string;
}

function Pages(props: IProps) {

    const { title } = props;
    const user = useAppSelector((store) => store.userReducer).user.name.split(" ");

    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const logout = () => {
        dispatch(resetUser())
        localStorage.removeItem("tokenAuth")
        navigate("/login", { replace: true })
    }

    return (
        <>
            <div className="page">
                <div className="page__head">
                    <h2 className="page__title">{title}</h2>
                    <div className="page__name">
                        <div className="page__info">
                            <span>{user[0]}</span>
                            <span>{user[1]}</span>
                        </div>
                        <div className="btn btn__active btn__table" onClick={logout}>
                            Выход
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pages