import React, { useEffect, useState } from "react";
import axios from "axios";

function AllCharts() {
  const [details, setDetails] = useState([]);
  const [weight_labels, setWeight_labels] = useState([]);
  const [weight_data, setWeight_data] = useState([]);

  const [fat_labels, setfat_labels] = useState([]);
  const [fat_data, setfat_data] = useState([]);

  const [bmi_labels, setBmi_labels] = useState([]);
  const [bmi_data, setBmi_data] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/details")
      .then(({ data }) => {
        setDetails(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (details.length > 0) {
      setWeight_labels(details[0].weight_label);
      setWeight_data(details[0].weight_data);

      setfat_labels(details[0].fat_labels);
      setfat_data(details[0].fat_data);

      setBmi_labels(details[0].bmi_labels);
      setBmi_data(details[0].bmi_data);
    }
  }, [details]);

  const final_weight_labels = weight_labels.map((date) => {
    const [day, month] = date.split("/");
    return `${day}/${month}`;
  });

  const final_fat_labels = fat_labels.map((date) => {
    const [day, month] = date.split("/");
    return `${day}/${month}`;
  });

  const final_bmi_labels = bmi_labels.map((date) => {
    const [day, month] = date.split("/");
    return `${day}/${month}`;
  });

  const chartData = encodeURIComponent(
    JSON.stringify({
      type: "line",
      data: {
        labels: final_weight_labels,
        datasets: [
          {
            label: "BMI History",
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            data: [57, 90, 11, -15, 37, -37, -27],
          },
          {
            label: "Body Fat History",
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(147, 216, 132, 0.7)",
            data: [71, -36, -94, 78, 98, 65, -61],
          },
          {
            label: "Body Weight History",
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(149, 189, 242, 0.534)",
            data: [48, -64, -61, 98, 0, -39, -70],
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Summary",
        },
        tooltips: {
          mode: "index",
        },
        hover: {
          mode: "index",
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Month",
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: "Value",
              },
            },
          ],
        },
      },
    })
  );

  const chartUrl = `https://quickchart.io/chart?c=${chartData}`;

  return <img src={chartUrl} alt="Body Weight Chart" />;

  return <div></div>;
}

export default AllCharts;
