import React from "react";
import { IoMdPerson } from "react-icons/io";
import InfoRow from "../components/InfoRow";
import Card1 from "../images/healthcare.png";
import Card2 from "../images/mri.png";
import Card3 from "../images/chemistry.png";
import Card4 from "../images/patient.png";
import RequestInfo from "../components/RequestInfo";
import AppointmentCards from "../components/AppointmentCards";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const gender = "male";
  const age = "21";
  const phone = "073456789";
  const address = "birtouta";
  const email = "bchmohamed@gmail.com";
  const NIN = "45678909876543567890";
  return (
    <section>
      <div className="first-cards">
        <div className="info">
          <div className="info-leftSide">
            <IoMdPerson size={70} />
            <h2 style={{ color: "#0052E0" }}>Your Name</h2>
            <p style={{ color: "#808080" }}>Appointment</p>
            <div className="appoint-info">
              <div className="appoint-text">
                {" "}
                5 <br /> upcomming
              </div>
              <div className="line"></div>
              <div className="appoint-text">
                {" "}
                3 <br /> past
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className="info-rightSide">
            <div className="info-row">
              <p>
                gender : {gender}{" "}
                <hr
                  style={{
                    border: "0.1px solid rgba(0, 94, 255, 0.19)",
                    marginTop: "2px",
                  }}
                />
              </p>
              <p>
                age : {age}
                <hr
                  style={{
                    border: "0.1px solid rgba(0, 94, 255, 0.19)",
                    marginTop: "2px",
                  }}
                />
              </p>
            </div>
            <div className="info-row">
              <p>
                phone : {phone}{" "}
                <hr
                  style={{
                    border: "0.1px solid rgba(0, 94, 255, 0.19)",
                    marginTop: "2px",
                  }}
                />
              </p>
              <p>
                address : {address}{" "}
                <hr
                  style={{
                    border: "0.1px solid rgba(0, 94, 255, 0.19)",
                    marginTop: "2px",
                  }}
                />
              </p>
            </div>
            <p>
              email : {email}
              <hr
                style={{
                  border: "0.1px solid rgba(0, 94, 255, 0.19)",
                  marginTop: "2px",
                }}
              />
            </p>
            <p>
              NIN : {NIN}
              <hr
                style={{
                  border: "0.1px solid rgba(0, 94, 255, 0.19)",
                  marginTop: "2px",
                }}
              />
            </p>
          </div>
        </div>
        <div className="medical">
          <h3>Appointments</h3>
          <InfoRow />
          <InfoRow />
          <InfoRow />
          <InfoRow />
        </div>
      </div>
      <div className="analyse-container">
        <div className="analyse-title">
          <h1>Analyse</h1>
          <select>
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div className="analyse-cards">
          <div className="analyse-card">
            <img src={Card1} alt="error" />
            <b>234</b>
            <p>consultation</p>
          </div>
          <div className="analyse-card">
            <img src={Card2} alt="error" />
            <b>34</b>
            <p>Radio</p>
          </div>
          <div className="analyse-card">
            <img src={Card3} alt="error" />
            <b>17</b>
            <p>Labo</p>
          </div>
          <div className="analyse-card">
            <img src={Card4} alt="error" />
            <b>7</b>
            <p>Opiration</p>
          </div>
        </div>
      </div>
      <div className="thourd-row">
        <div className="appintment">
          <h1>My appintment</h1>
          <div className="appintment-container">
            <div className="appointment-content">
              <div className="line" style={{ width: "4px" }}></div>
              <div className="appointment-cards">
                <AppointmentCards />
                <AppointmentCards />
                <AppointmentCards />
                <AppointmentCards />
                <AppointmentCards />
              </div>
            </div>
            <div>
              <Link to={'consulation'}>Add appointment</Link>
            </div>
          </div>
        </div>
        
        <div className="Requests-container">
          <h1>Requestes status</h1>
          <div className="Requests-content">
            <RequestInfo />
            <RequestInfo />
            <RequestInfo />
            <RequestInfo />
            <RequestInfo />
            <RequestInfo />
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Dashboard;
