import images from '../assets/images';
import '../styles/landing-style-reg.css'
import '../styles/fonts.css'
function Register(){
    return(
        <>
            <div class="login-box-reg" id="login-box-reg">
                <img src={images.bg_img4} class="overlay-img" id="overlay-img0-reg" />
                <img src={images.bg_img5} class="overlay-img" id="overlay-img1-reg" />
                <br /><br />
                <div>
                    <h1 className="title">Welcome to PageRhymth</h1>
                    <p className="title">Sign Up to Continue</p>
                </div>
                <br />
                <form>
                    <div className="input-container">
                        <img src={images.user} class="input-icon" />
                        <input type="text" placeholder="Enter Your Full Name" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.mail} class="input-icon" />
                        <input type="email" placeholder="Enter Your Email" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.lock} className="input-icon" />
                        <input type="password" placeholder="Create Password" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.lock} className="input-icon" />
                        <input type="password" placeholder="Confirm Password" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.calendar} className="input-icon" />
                        <input type="date" placeholder="Date Of Birth (DD/MM/YY)" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.pencil} className="input-icon" id="input-icon-textarea" />
                        <textarea placeholder="Write your bio here" className="input-textarea" required></textarea>
                    </div>

                    <div className="link-submitBtn">
                        <input type="checkbox" />
                        <a href="#" className="custom-link">Agree with the Terms</a>
                        <button type="submit" className="btn" id="btn-signup">Sign Up</button>
                    </div>
                </form>
            </div>
            <div className="img-container2" id="left-corner-reg-img">
                <img src={images.bg_img2} class="overlay-img2-reg"/>
            </div>
            <div className="img-container3" id="right-corner-reg-img">
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
export default Register