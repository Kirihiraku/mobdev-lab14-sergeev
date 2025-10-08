import { Link } from "react-router-dom"

const NavBar = () => {
    return (
        <div className="navbar">
            <h2 className="navbar-brand">Feedback</h2>
            <div className="navbar-nav">
                <Link className="navbar-link" to={"/"}>Домой</Link>
            </div>
        </div>
    )
}

export default NavBar
