import images from "../images";
import "../styles/fonts.css";

export default function Background(){
    return(
        <span className="container">
            <div className="page-logo">
                <img src={images.logo1} id="img-logo"/>
                <h1>PageRhythm</h1>
            </div>
        </span>
    );
}