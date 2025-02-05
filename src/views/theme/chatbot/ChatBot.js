import { useState,useEffect } from 'react'
import './ChatBot.css'

import io from "socket.io-client";

const socket = io("http://localhost:5000");



export default function Component() {
  const [activeChats, setActiveChats] = useState([
    {
      id: '1',
      name: 'John Doe',
      role: 'Salesman',
      lastMessage: 'Thank you for your help',
      date: '08/15/2024',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Manager',
      lastMessage: 'How can I assist you?',
      date: '08/14/2024',
    },
  ])

  const [selectedChat, setSelectedChat] = useState(null)
  // const [messages, setMessages] = useState([
  //   {
  //     id: '1',
  //     sender: 'John Doe',
  //     content: 'Hello, I need some assistance with a client.',
  //     timestamp: '10:30 AM',
  //   },
  //   { id: '2', sender: 'You', content: 'Sure, what can I help you with?', timestamp: '10:32 AM' },
  // ])

  const userName = "pavan"; // Replace with dynamic username from token

  const receiverUserName = "gagan";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");

  const [newMessage, setNewMessage] = useState('')

              // new code start from here

              useEffect(() => {
                if (userName && !roomId) { 
                  const room = generateRoomId(userName, receiverUserName);
                  setRoomId(room);
                  socket.emit("joinRoom", { room, username: userName });
                }
              }, [userName, roomId]);

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
              
              console.log("first",messages); 
          

              const generateRoomId = (user1, user2) => {
                return [user1, user2].sort().join("_");
              };

              const handleSendMessage = () => {
                if (message.trim()) {
                  socket.emit("sendMessage", { room: roomId, message, sender: userName,receiver:receiverUserName });
                  setMessage(""); // Clear the input
                }
              };




              // new code end here










  // const handleSendMessage = () => {
  //   if (newMessage.trim() === '') return
  //   const newMsg = {
  //     id: Date.now().toString(),
  //     sender: 'You',
  //     content: newMessage,
  //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //   }
  //   setMessages([...messages, newMsg])
  //   setNewMessage('')
  // }

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
                <ul className="list-unstyled mb-0">
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
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
                          <p className="fw-bold mb-0">Marie Horwitz</p>
                          <p className="small text-muted">Hello, Are you there?</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Just now</p>
                        <span className="badge bg-danger rounded-pill float-end">3</span>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Alexa Chung</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">5 mins ago</p>
                        <span className="badge bg-danger rounded-pill float-end">2</span>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Danny McChain</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-danger badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Ashley Olsen</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>

                  <li className="p-2">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Ben Smith</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-7 col-xl-8">
            <div className="flex flex-column ">
              <div className="d-flex flex-row bg-body-tertiary p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 1"
                  style={{ width: 45, height: '100%' }}
                />
                <div>
                  <p className="fw-bold p-2 ms-3 mb-1 ">Lorem ipsum dolor</p>
                </div>
              </div>
              <div>
              {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "me" ? "flex-end" : "flex-start", // Right for sender, left for receiver
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === "me" ? "#007bff" : "#ccc",
                color: msg.sender === "me" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
                margin: "5px 0",
                textAlign: "left",
              }}
            >
              <strong>{msg.sender}: </strong> {msg.message}
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
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Chat App</h1>
      <div
        style={{
          width: "60%",
          margin: "0 auto",
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Ensures the latest message stays at the bottom
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "me" ? "flex-end" : "flex-start", // Right for sender, left for receiver
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === "me" ? "#007bff" : "#ccc",
                color: msg.sender === "me" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
                margin: "5px 0",
                textAlign: "left",
              }}
            >
              <strong>{msg.sender}: </strong> {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: "10px", width: "300px" }}
        />
        <button
          onClick={handleSendMessage}
          style={{ padding: "10px 20px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
  
  
  
  
}
