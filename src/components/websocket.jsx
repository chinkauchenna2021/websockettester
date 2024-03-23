import  { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useLocalStorage from 'use-local-storage';

const WebSocketClient = () => {
  const [socketUrl, setSocketUrl] = useState('');
  const [message, setMessage] = useState('');
  const [payload, setPayload] = useState('');
  const [response, setResponse] = useState('');
  const [socket, setSocket] = useLocalStorage('socket', '');


  useEffect(()=>{
    setSocket("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {

    if (!socketUrl) return;

          const newSocket = io(socketUrl); // Use socketUrl instead of socket
          setSocket(newSocket);
      
          newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
          });
      
          newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
          });
      
          newSocket.on("response", (data) => {
            console.log("this is the data gotten from Nestjs" , data)
            setResponse(data);
          });
          return () => {
            newSocket.disconnect();
          };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketUrl]); // Only observe socketUrl

  const connectWebSocket = () => {
    if (!socketUrl) return;
     setSocketUrl(socketUrl)
  };

  const sendToWebSocket = () => {
    const newSocket = io(socketUrl); // Use socketUrl instead of socket
    newSocket.emit(message, payload);
    console.log('Sent message:', message);
    setSocket(newSocket)
      
  };

  return (
    <div className="container w-full flex justify-center items-center space-y-4 min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center text-blue-400 tracking-wide mb-4">WebSocket Tester</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              onChange={(e) => setSocketUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none"
              placeholder="wss://example.com"
            />
            <button onClick={connectWebSocket} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Connect</button>
          </div>
          <div className="mt-4">
            <textarea
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
              placeholder="Enter Message"
            />
          </div>
          <div className="mt-4">
            <textarea
              type="text"
              onChange={(e) => setPayload(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
              placeholder="Enter Payload"
            />
          </div>
          <div className="mt-4">
            <button onClick={sendToWebSocket} className="w-full px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 focus:outline-none">Send</button>
          </div>
        </div>
        <div className="p-4 bg-gray-200">
          <h3 className="text-xl font-semibold text-center mb-2">Response</h3>
          <textarea value={response} readOnly className="w-full h-32 border border-gray-300 rounded px-4 py-2 focus:outline-none" />
        </div>
      </div>
    </div>
  );
};

export default WebSocketClient;