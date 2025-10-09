import Button from "../components/Button"
import Input from "../components/Input"
import { Link } from "react-router-dom"

const SignUp = () => {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Регистрация</h1>
                <form className="auth-form">
                    <Input />
                    <Input />
                    <Input />
                    <Input type="password" />
                    <Button>Зарегистрироваться</Button>
                </form>
                <footer className="auth-footer">
                    <Link to="/signin">Войти</Link>
                </footer>
            </div>
        </div>
    )
}

export default SignUp
