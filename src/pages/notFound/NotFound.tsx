import { Link } from "react-router-dom";
import "./NotFound.css";
import { Button } from "antd";

const NotFoundPage = () => {
  return (
    <div className="container__notfound">
      <h1 className="notFound">
        The page you are looking for <div className="select">not found</div>
      </h1>
      <Link to="/">
        <Button type="primary" className="not-found__button button_primary">
          Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
