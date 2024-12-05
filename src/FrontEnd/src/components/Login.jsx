import Background from "./Background";
import images from '../assets/images';
import '../styles/landing-style.css'
import '../styles/fonts.css'
function Login(){
    return(
        <>
        <div className="login-box" id="login_box">
            <img src={images.bg_img4} className="overlay-img" id="overlay-img0" />
            <img src={images.bg_img5} className="overlay-img" id="overlay-img1" />
            <br /><br />
            <div className="login-title">
                <h1>Welcome Back</h1>
                <p id="p-direct-login-text">Login to Continue</p>
            </div>
            <br />
            <form>
                <div className="input-container">
                    <img src={images.user} className="input-icon" />
                    <input type="email" placeholder="Enter Your Email" class="input-info" required />
                </div>
                <div className="input-container">
                    <img src={images.lock} className="input-icon" />
                    <input type="password" placeholder="Enter Your Password" className="input-info" required />
                </div>
                <button type="submit" className="btn">Login</button>
                <a href="reset_password1.html" className="forgot-password">Forgot password</a>
                <div className="google-login">
                    <p id="p-gLogin">Login with</p>
                    <a href="#">
                        <img src={images.google} />
                    </a>
                </div>

            </form>
        </div>
        <div className="img-container2" id="left-corner-img">
            <img src={images.bg_img2} class="overlay-img2-reg" />
        </div>
        <div className="img-container3" id="right-corner-img">
            <div className="overlay-img4-reg">
                <img src={images.bg_img3} />
                <div className="overlay-img3-reg">
                    <img src={images.bg_img1} id="overlay-core-img3" />
                </div>
            </div>
        </div>
        </>
        
           
    )
}

export default Login