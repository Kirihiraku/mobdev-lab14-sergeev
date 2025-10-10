import { useState } from "react"
import Button from "../components/Button"
import Input from "../components/Input"
import { Link } from "react-router-dom"

const SignUp = () => {
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("")

        if (e.target.password.value != e.target.password2.value) {
            setError("Пароли не совпадают")
            return
        }
        
        const user = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Регистрация</h1>
                {error.length > 0 && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <Input required name="username" />
                    <Input required name="email" type="email" />
                    <Input required name="password" type="password" />
                    <Input required name="password2" type="password" />
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
