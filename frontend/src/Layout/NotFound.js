import image from "../Asset/404.jpg";

function NotFound() {
    return (
        <div className="container">
            <img className="responsive-img" alt="Page not found" src={image} />
        </div>
    );
}
export default NotFound;