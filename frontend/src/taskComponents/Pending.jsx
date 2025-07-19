import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import {api} from '../Lib/axios';
// import './total.css'
const Pending = () => {
     const [todo,setTodo] = useState([])
         useEffect(()=>{
           const fetchNote = async()=>{
             try {
               const receivedData = await api.get('http://localhost:3800/api/notes')
               const pendingData = receivedData.data
               const updatePendingData = pendingData.filter((item)=>item.status === "Pending")
               setTodo(updatePendingData)
             } catch (error) {
               console.log(error,'error')
             }
           }
           fetchNote()
         },[])
        
         
         const statusChange = async (e, id) => {
        const newStatus = e.target.value;
        console.log(newStatus);
        console.log(id);

  try {
    const response = await api.put(`http://localhost:3800/api/notes/${id}`, {
      status: newStatus,
    });

    const updatedNote = response.data;

    // Update only the modified item in the todo list
    const updatedTodos = todo.map((item) =>
      item._id === id ? { ...item, status: updatedNote.status } : item
    );

    setTodo(updatedTodos);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
         const handleDelete = async(id)=>{
          console.log(id)
          await api.delete(`http://localhost:3800/api/notes/${id}`)
          const filterdData = todo.filter((item)=>item._id != id)
          setTodo(filterdData)
            }
  return (
  <>
       <Link to="/home">
            <div className="icon" title="Go Back" id='iconId'>
            <FaArrowLeft size={24} color="#333" />
            </div>
          </Link>
  <div className="notes-grid">
    {todo.length === 0 ? (
      <div className="empty-state">
          <h5>No Pending Tasks Found</h5>
        <p>You haven’t created any task yet. Start now!</p>
        <Link to="/create">
          <button className="add-task-btn">
            <i className="fas fa-plus-circle"></i> Add New Task
          </button>
        </Link>
      </div>
    ) : (
      <>
        {todo.map((item) => (
          <div className="note-card-ui" key={item._id}>
              <div className="note-content-ui">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
              <div className="note-meta-ui">
                <span className={`badge status-${item.status?.toLowerCase() || 'pending'}`}>
                  {item.status}
                </span>
                <div className="status-dropdown-container">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={item.status}
                onChange={(e)=>{statusChange(e,item._id)}}
                className={`status-select ${item.status?.toLowerCase().replace('-', '') || 'pending'}`}
                  >
                <option value="Pending">Pending</option>
                <option value="In-progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
                </div>
                <span className="created-date">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="created-time">
                  {new Date(
                    item.updatedAt !== item.createdAt ? item.updatedAt : item.createdAt
                  ).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>

            <div className="note-actions-ui">
              <Link to={`/update/${item._id}`} className="btn edit">
                <FaEdit />
              </Link>
              <button onClick={() => handleDelete(item._id)} className="btn delete">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </>
    )}
  </div>
</>

  )
}

export default Pending