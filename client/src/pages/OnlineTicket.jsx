import React from "react";

const OnlineTicket = () => {

  const username = "bouchelaghem mohamed";
  const waitingList = 12;
  const ticketNumber = 23;
  const date = new Date;
  const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  const service = " مصلحة الاستعجالات";


  return (
    <section
      style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}
    >
      <div className="ticket-container">
        <h1 style={{ color: "#0052E0" }}>Online ticket</h1>
        <div className="ticket-content">
          <div className="ticket-header">
            <p>REPUBLIQUE ALGERIA DEMOCRATIQUE POPULAR</p>
            <p>minister de la sante</p>
          </div>
          <p className="ticket-info">
            waiting list : <span style={{ color: "#B9C600" }}>{waitingList}</span>
          </p>
          <div className="ticket-num">
            <h1 style={{ fontSize: "100px" }}>{ticketNumber}</h1>
          </div>
          <div className="ticket-info">
            <p>Nom et Prenom : {username} </p>
            <p>service :{service}</p>
            <p>cree le : {formattedDate} </p>
          </div>
          <p style={{ margin: "auto",fontSize:"large", color:"#000000a1" }}>online ticket for Radiology test </p>
        </div>
      </div>
    </section>
  );
};

export default OnlineTicket;
