import React from "react";
import { Link } from "react-router-dom";

const RadioTicket = () => {
  const ticket = false;

  return (
    <section
      style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}
    >
      {ticket ? (
        <div className="allowed">
          <h1 style={{ color: "#0052E0" }}>Radio ticket</h1>
          <div className="book-div">
            <p>
              we have accepted you now take a ticket for today if you are ready
              for it{" "}
            </p>
            <Link to={"/radio/radio-ticket/:123/online-ticket"}>Book Now</Link>
          </div>
          <div className="note">
            <h3 style={{ color: "#0052E0" }}>Note :</h3>
            <p style={{ margin: "auto" }}>
              the boking is valide for only <span>5</span> days it started in{" "}
              <span>2025/02/23</span> ti remain <span>2</span> days
            </p>
          </div>
        </div>
      ) : (
        <div className="not-allowed">
          <div className="not-allowed-container">
            <h3 style={{ color: "#0052E0" }}>Hellow mohamed</h3>
            <p style={{ margin: "auto", fontSize:"large" }}>
              our team will check you prescription as soon as possible thanks
              for waiting you will get notification when it done
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default RadioTicket;
