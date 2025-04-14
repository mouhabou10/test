import React from "react";
import { results } from "../components/data";
import { useState } from "react";
import Avatar1 from "../images/report.png";
import Avatar2 from "../images/lab-test.png";
import Avatar3 from "../images/health-check.png";

const Result = () => {
  const [result, setResult] = useState(results);
  return (
    <section style={{ marginLeft: "20%", marginRight: "5%" }}>
      <h1 style={{ color: "#0052E0" }}>shoose type</h1>
      <div className="result-table">
        {result.map(({ name, type }) => {
          if (type === "labo") {
            return (
              <div className="result-content">
                <div>
                  <img src={Avatar2} />
                  <h2 style={{ paddingLeft: "15px", color: " #4c4c4c" }}>
                    {name}
                  </h2>
                </div>
                <p>download</p>
              </div>
            );
          } else if (type === "radio") {
            return (
              <div className="result-content">
                <div>
                  <img src={Avatar3} />
                  <h2 style={{ paddingLeft: "15px", color: " #4c4c4c" }}>
                    {name}
                  </h2>
                </div>
                <p>download</p>
              </div>
            );
          } else {
            return (
              <div className="result-content">
                <div>
                  <img src={Avatar1} />
                  <h2 style={{ paddingLeft: "15px", color: " #4c4c4c" }}>
                    {name}
                  </h2>
                </div>
                <p>download</p>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
};

export default Result;
