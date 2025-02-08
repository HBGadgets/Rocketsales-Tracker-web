import { useState,useEffect } from 'react'
import './ChatBot.css'
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';

import io from "socket.io-client";
import axios from 'axios';


const socket = io(import.meta.env.VITE_SERVER_URL); 



export default function Component() {


  const accessToken = Cookies.get('token');
  if (!accessToken) {
    throw new Error('Token is missing');
  }

  const decodedToken = jwt_decode(accessToken);

    const userName = decodedToken.username;
    const chatusername = decodedToken.chatusername;


  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
 
  const [selectedUsername, setSelectedUsername] = useState(null)
  const[chatAdmin,setchatAdmin]=useState(null)


  const [newMessage, setNewMessage] = useState('')

              // new code start from here

              useEffect(() => {        
                if (userName && (selectedUsername || chatAdmin)) { 
                    const room = generateRoomId(userName, selectedUsername || chatAdmin);
                    setRoomId(room);
                    
                    socket.emit("joinRoom", { 
                        room, 
                        username: userName 
                    });
                }
            }, [userName, chatAdmin, selectedUsername]); 
              useEffect(() => {

                // Create a function to handle incoming messages
                const handleReceiveMessage = (data) => {
                  setMessages((prevMessages) => [...prevMessages, data]);
                };
              
               
                socket.on("receiveMessage", handleReceiveMessage);
              
                
                return () => {
                  socket.off("receiveMessage", handleReceiveMessage);
                };
              }, []); 
              
          

              const generateRoomId = (user1, user2) => {
                return [user1, user2].sort().join("_");
              };

              const handleSendMessage = () => {
                if (message.trim()) {
                  socket.emit("sendMessage", { room: roomId, message, sender: userName,receiver:chatAdmin || selectedUsername });
                  setMessage(""); // Clear the input
                }
              };


               const fetchData = async () => {
                const accessToken = Cookies.get('token')
                console.log('accessToken:', accessToken)
                const url = `${import.meta.env.VITE_SERVER_URL}/api/chatboxuser`
          
                try {
                  const response = await axios.get(url, {
                    headers: {
                      Authorization: 'Bearer ' + accessToken,
                    },
                  })
                  setLoading(false)
                  console.log('Full Response Data:', response.data)

                  setData(response.data);
          
                } catch (error) {
                  setLoading(false)
                  console.error('Error fetching data:', error)
                  throw error 
                }
              }
          
 useEffect(() => {
      setLoading(true)
     
      fetchData() 
    }, [])


  const handleSalesmanClick = (username) => {
   setSelectedUsername(username);
         setMessages([]);

     };

  const handleAdminClick = (username) => {
    setSelectedUsername(null);
    setchatAdmin(username);
    setMessages([]);
    
  };
  


                   // new code end here

  return (
    <>
      <div className="container fs-5">
        <div className="row">
          <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
            <div className="p-3">
              <div className="input-group rounded mb-3">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <span className="input-group-text border-0" id="search-addon">
                  search
                </span>
              </div>
              <div
                data-mdb-perfect-scrollbar-init
                className="overflow-y-scroll"
                style={{ height: '70vh' }}
              >
              <div>
              <a href="#!" className="d-flex justify-content-between text-decoration-none">
                <div className="d-flex flex-row">
                  <div>
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                      alt="avatar"
                      className="d-flex align-self-center me-3"
                      width={60}
                    />
                    <span className="badge bg-success badge-dot" />
                  </div>
                  <div className="pt-1">
                    <p className="fw-bold mb-0" onClick={() => handleAdminClick(chatusername)}>Admin</p>
                    <p className="small text-muted">Hello, Are you there?</p>
                  </div>
                </div>
                {/* <div className="pt-1">
                  <p className="small text-muted mb-1">Just now</p>
                  <span className="badge bg-danger rounded-pill float-end">3</span>
                </div> */}
              </a>
              </div>

             {data.map((user)=>( <ul className="list-unstyled mb-0">
              <li key={user.id}  onClick={() => handleSalesmanClick(user.username)}  className="p-2 border-bottom">
              <a href="#!" className="d-flex justify-content-between text-decoration-none">
                <div className="d-flex flex-row">
                  <div>
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                      alt="avatar"
                      className="d-flex align-self-center me-3"
                      width={60}
                    />
                    <span className="badge bg-success badge-dot" />
                  </div>
                  <div className="pt-1">
                    <p className="fw-bold mb-0">{user.companyName || user.branchName ||user.supervisorName ||user.salesmanName}</p>
                    <p className="small text-muted">Hello, Are you there?</p>
                  </div>
                </div>
                {/* <div className="pt-1">
                  <p className="small text-muted mb-1">Just now</p>
                  <span className="badge bg-danger rounded-pill float-end">3</span>
                </div> */}
              </a>
            </li>
      
                </ul>))}
              </div>
            </div>
          </div>


          
          <div className="col-md-6 col-lg-7 col-xl-8">
            {selectedUsername ||chatAdmin ?<div className="flex flex-column ">
              <div className="d-flex flex-row bg-body-tertiary p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 1"
                  style={{ width: 45, height: '100%' }}
                />
                
                <div>
                  <p className="fw-bold p-2 ms-3 mb-1 ">{selectedUsername || "Admin"}</p>
                </div>
              </div>
              <div>
              {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === userName ? "flex-end" : "flex-start", // Right for sender, left for receiver
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === userName ? "#007bff" : "#ccc",
                color: msg.sender === "me" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
                margin: "5px 0",
                textAlign: "left",
              }}
            >
              {msg.message} <br /> 
              <div className='d-flex justify-content-between gap-3'>
              <p>{msg.sender} </p>
              {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </div>

            </div>
          </div>
        ))}
           </div>

              <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 3"
                  style={{ width: 40, height: '100%' }}
                />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control form-control-lg ms-2"
                  id="exampleFormControlInput2"
                  placeholder="Type message"
                />
                <button
                  onClick={handleSendMessage}
                  className="form-control w-auto form-control-lg ms-2"
                >
                  Send
                </button>

                <a className="ms-1 text-muted" href="#!">
                  <i className="fas fa-paperclip" />
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <i className="fas fa-smile" />
                </a>
                <a className="ms-3" href="#!">
                  <i className="fas fa-paper-plane" />
                </a>
              </div>
            </div>:""}
          </div>
        </div>
      </div>
    </>
  )

  
}
