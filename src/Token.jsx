import { useState, useEffect } from "react";

import { onMessage } from "firebase/messaging";
import { generateToken, messaging } from "./notlifications/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Token = () => {
  const [token, setToken] = useState("");
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    const setupFirebaseMessaging = async () => {
      const getToken = await generateToken();
      setToken(getToken);
      onMessage(messaging, (payload) => {
        console.log(payload);

        setBody(payload.notification.body);
        setTitle(payload.notification.title);

        toast(
          <div>
            <h3>{payload.notification.title}</h3>
            <p>{payload.notification.body}</p>
          </div>
        );
      });
    };

    setupFirebaseMessaging();
  }, []);

  const handleClick = async () => {
    const requestBody = {
      title: "Button Clicked",
      body: "You click copy token button",
      image:
        "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
      token: token,
    };
    console.log("requestBody", requestBody);
    await axios
      .post(
        "http://localhost:8000/notification/sendPushNotification",
        requestBody
      )
      .then((response) => {
        console.log("Notification sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        toast.error("Failed to send notification");
      });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <p>push notification</p>
      <button onClick={() => handleClick()}>Copy Token</button>
    </>
  );
};

export default Token;
