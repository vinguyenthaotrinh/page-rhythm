import React, {useState, useEffect} from 'react';
import images from '../assets/images';
import '../styles/landing-style-reg.css'
import '../styles/fonts.css'
import { Form } from 'react-router-dom';
import Background from './Background';
function Register(){

    const [formData, setFormData] = useState(
        {fullname:"",
         email:"",
         password:"",
         confirmPass:"",
         dateOfBirth:"",
         bio:"",
        });

    function handleChange(e){
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    return(
        <>
            <Background/>
            <div className="login-box-reg" id="login-box-reg">
                <img src={images.bg_img4} className="overlay-img" id="overlay-img0-reg" />
                <img src={images.bg_img5} className="overlay-img" id="overlay-img1-reg" />
                <br /><br />
                <div>
                    <h1 className="title">Welcome to PageRhymth</h1>
                    <p className="title">Sign Up to Continue</p>
                </div>
                <br />
                <form>
                    <div className="input-container">
                        <img src={images.user} className="input-icon" />
                        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} 
                        placeholder="Enter Your Full Name" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.mail} className="input-icon" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="Enter Your Email" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.lock} className="input-icon" />
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                        placeholder="Create Password" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.lock} className="input-icon" />
                        <input type="password" name="confirmPass" value={formData.comfirmPass} onChange={handleChange}
                        placeholder="Confirm Password" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.calendar} className="input-icon" />
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                        placeholder="Date Of Birth (DD/MM/YY)" className="input-info" required />
                    </div>

                    <div className="input-container">
                        <img src={images.pencil} className="input-icon" id="input-icon-textarea" />
                        <textarea name="bio" value={formData.bio} onChange={handleChange}
                        placeholder="Write your bio here" className="input-textarea" required></textarea>
                    </div>

                    <div className="link-submitBtn">
                        <input type="checkbox" required/>
                        <a href="#" className="custom-link">Agree with the Terms</a>
                        <button type="submit" className="btn" id="btn-signup">Sign Up</button>
                    </div>
                </form>
            </div>
            <div className="img-container2" id="left-corner-reg-img">
                <img src={images.bg_img2} className="overlay-img2-reg"/>
            </div>
            <div className="img-container3" id="right-corner-reg-img">
                <div className="overlay-img4-reg">
                    <img src={images.bg_img3}/>
                    <div className="overlay-img3-reg">
                        <img src={images.bg_img1} id="overlay-core-img3"/>
                    </div>
                </div>
            </div>
            <p>Full Name: {formData.bio}</p>
        </>
    )
}
export default Register