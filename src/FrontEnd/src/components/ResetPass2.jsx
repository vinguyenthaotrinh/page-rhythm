import images from '../assets/images';
import '../styles/landing-style.css'
import '../styles/fonts.css'
function ResetPass2(){
    return(
        <>
            <div className="login-box" id="login_box">
                <img src={images.bg_img4} class="overlay-img" id="overlay-img0" />
                <img src={images.bg_img5} class="overlay-img" id="overlay-img1" />
                <br /><br />
                <div className="login-title">
                    <h1>Forgot Your Password?</h1>
                    <p id="p-direct-login-text">Don't worry</p>
                </div>
                <br />
                <form>
                    <div className="input-container">
                        <img src={images.lock} className="input-icon" />
                        <input type="password" placeholder="New Password" className="input-info" required />
                    </div>
                    <div className="input-container">
                        <img src={images.lock} className="input-icon" />
                        <input type="password" placeholder="Confirm Password" className="input-info" required />
                    </div>
                    <button type="submit" className="btn">Submit</button>

                </form>
            </div>
            <div className="img-container2" id="left-corner-img">
                <img src={images.bg_img2} class="overlay-img2-reg"/>
            </div>
            <div className="img-container3" id="right-corner-img">
                <div className="overlay-img4-reg">
                    <img src={images.bg_img3}/>
                    <div className="overlay-img3-reg">
                        <img src={images.bg_img1} id="overlay-core-img3"/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ResetPass2