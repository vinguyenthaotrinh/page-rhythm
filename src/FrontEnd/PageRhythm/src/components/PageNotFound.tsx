import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="page-not-found">
            <NavigationBar />
            <h1>404 - Page Not Found</h1>
        </div>
    )
}