import images from '../assets/images'
import '../styles/fonts.css'
function Background(){
    return(
        <span className="container">
            <div className="page-logo">
                <img src={images.logo1} id="img-logo"/>
                <h1>PageRhythm</h1>
            </div>

            {/* <div className="img-container2">
                <img src={images.bg_img2} class="overlay-img2-reg"/>
            </div>
            <div className="img-container3">
                <div className="overlay-img4-reg">
                    <img src={images.bg_img3}/>
                    <div className="overlay-img3-reg">
                        <img src={images.bg_img1} id="overlay-core-img3"/>
                    </div>
                </div>
            </div> */}
        </span>
    );
}
export default Background