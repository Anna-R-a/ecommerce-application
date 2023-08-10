import { Link } from "react-router-dom";
import './NotFound.css';

const NotFoundPage = () => {

    return (
        <>
            <h1>NotFound page</h1>
            <Link to="/">Home</Link>
        </>
    );
};

export default NotFoundPage;
