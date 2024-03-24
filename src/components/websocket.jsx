import { useState } from "react";
import io from "socket.io-client";
import useLocalStorage from "use-local-storage";

const WebSocketClient = () => {
  const [socketUrl, setSocketUrl] = useState("");
  const [message, setMessage] = useState("");
  const [payload, setPayload] = useState("");
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useLocalStorage("socket", "");

  const connectWebSocket = () => {
    if (!socketUrl) return;

    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setResponse("Connected to WebSocket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setSocket(null);
    });

    newSocket.on("response", (newData) => {
      console.log("Received response from NestJS:", newData);
      setResponse(
        (data) =>
          data +
          `\n\r Received response from websocket endpoint :, ${JSON.stringify(
            newData
          )} `
      );
    });

    return () => {
      newSocket.disconnect();
    };
  };

  const sendToWebSocket = () => {
    if (!socket || !message || !payload) return;

    socket.emit(message, payload);
    setSocket(socket);
    console.log("Sent message:", message);
    setResponse((data) => data + `\n\r Sent message : ${message} `);
  };

  return (
    <div className="container w-full flex justify-center items-center space-y-4 min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center text-blue-400 tracking-wide mb-4">
            WebSocket Tester
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={socketUrl}
              onChange={(e) => setSocketUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none"
              placeholder="wss://example.com"
            />
            <button
              onClick={connectWebSocket}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Connect
            </button>
          </div>
          <div className="mt-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
              placeholder="Enter Message"
            />
          </div>
          <div className="mt-4">
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
              placeholder="Enter Payload"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={sendToWebSocket}
              className="w-full px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-200">
           <div className="text-sm text-red-400 py-2 flex justify-center items-center capitalize">Make sure that your WebSocket emits the message as 'response' with data if any, to allow the tester to capture it </div>
          <h3 className="text-xl font-semibold text-center mb-2">Response</h3>
          <textarea
            value={response}
            readOnly
            className="w-full h-32 border border-gray-300 rounded px-4 py-2 focus:outline-none text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default WebSocketClient;
