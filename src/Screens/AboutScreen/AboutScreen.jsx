import React, { useEffect } from "react";
import { AboutContainer } from "./Styles";
import aboutMain from "../../img/about-1.jpg";
import aboutSecondary from "../../img/about-4.jpg";
import { Link } from "react-router-dom";

const AboutScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AboutContainer>
      <div className="left-side">
        <img src={aboutMain} alt="aboutMain" className="img-main" />
        <img
          src={aboutSecondary}
          alt="aboutSecondary"
          className="img-secondary"
        />
      </div>
      <div className="right-side">
        <div className="right-sub">
          <h1>VEGGI 365</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas sint
            temporibus non provident officiis numquam rem facere itaque
            doloremque totam illo cumque, veritatis minima. Tenetur rem quis
            vitae officiis corporis! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam unde dolore ut reprehenderit quibusdam
            maiores consequuntur laboriosam eius quo ducimus molestiae, saepe
            laborum ipsa quaerat sunt error ullam culpa repellat?
          </p>
          <Link to="/" style={{ textDecoration: "none", color: "#4ac85d" }}>
            <button className="aboutbtn">Explore Veggi</button>
          </Link>
        </div>
      </div>
    </AboutContainer>
  );
};

export default AboutScreen;
