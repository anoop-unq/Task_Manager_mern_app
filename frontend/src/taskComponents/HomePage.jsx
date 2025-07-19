import React, { useEffect, useState } from 'react'
import {FaPlus,FaEdit,FaTrash, FaArrowLeft} from 'react-icons/fa'

import './home.css'
import { Link, useNavigate } from 'react-router-dom';
import {FaTimes ,FaTasks} from 'react-icons/fa'; 
import axios from 'axios'
import toast from 'react-hot-toast';
import { api } from '../Lib/axios';



const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const [loading,setLoading] = useState(true)
  const [todo,setTodo] = useState([])
  useEffect(()=>{
    const fetchNote = async()=>{
      try {
        const receivedData = await api.get('http://localhost:3800/api/notes')
        console.log(receivedData,"555")
        setTodo(receivedData.data)
        
      } catch (error) {
        console.log(error,'error')
      }
      finally {
        setTimeout(()=>{
          setLoading(false);
        },500)
    }
    }
    fetchNote()
  },[])
  const handleDelete = async(e,id)=>{
    e.preventDefault()
    await api.delete(`http://localhost:3800/api/notes/${id}`)
    setTodo(prev => prev.filter(item => item._id !== id));
        toast.success('Task deleted successfully !', {
  icon: '✅',
  style: {
    borderRadius: '8px',
    background: '#fd3838ff',
    color: '#fff',
    fontWeight: 'bold',
  },
});
  }
  return (
    <>   

      <nav className="navbar">
        <div className="logo">
          <FaArrowLeft onClick={()=>navigate("/")} className="logo-icon" />
          </div>

          <div className='same-row-items'>
            <Link to="/create" className="add-user-link">
            <div className="add-user-btn">
              <FaPlus className="plus-icon" />
              <span>Add User</span>
            </div>
          </Link>
        <div className="hamburger" onClick={toggleMenu}>
          
          {isOpen ? <FaTimes className="icon" /> : (
            <>
              <div></div>
              <div></div>
              <div></div>
            </>
            
          )}
          </div>
           <ul className="nav-links">
        <li>          <Link to='/total'>
           Total
          </Link></li>
        <li> <Link to={`/pending/`}>
           Pending
          </Link></li>
        <li> <Link to={`/completed`}>
           Completed
          </Link></li>
        <li><Link to={`/inprogress`}>
           In-Progress
          </Link></li>
          
      </ul>
        </div>
      </nav>
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
       
          <Link to='/total'>
           Total
          </Link>
          <Link to={`/pending/`}>
           Pending
          </Link>
            <Link to={`/completed`}>
           Completed
          </Link>
           <Link to={`/inprogress`}>
           In-Progress
          </Link>
        
      </div>
   
    {loading ? (
  <div className="spinner-container">
    <div className="spinner" ></div>
  </div>
) : todo.length === 0 ? (
      <>
      <div className="empty-state-card">
      <div className="icon-wrapper">
        <i className="fas fa-folder-open"></i>
      </div>
      <h2 className="empty-heading">Your Task Board is Clean</h2>
      <p className="empty-description">
        You're all caught up! Start adding tasks to stay organized and productive.
      </p>
      <Link to='/create'>
       <button className="add-task-btn">
        <i className="fas fa-plus-circle"></i> Add New Task
      </button>
      </Link>
     </div>
      </>
    ):(
    <div className="card-grid">
  {todo.map((item) => (
   <div className='flex-it' key={item._id}>
    <div className="note-card"  >
   <Link to={`/update/${item._id}`} className="note-link">
     <div className="note-content">
        <h3 className="note-title">
          <span className="label">Title:</span> {item.title}
        </h3>
        <hr className="horizontal" />
        <p className="note-body">
          <span className="label">Description:</span> {item.content}
        </p>
      </div>
    <div className="note-status-row">
        <div className={`status-badge status-${item.status}`}>
          {item.status}
        </div>
      <div className="date-container">
      <span className="date-label">Created on</span>
      <span className="date-text">
        {new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </span>
      </div>
         <p className="time-badge">
          {item.updatedAt !== item.createdAt && <strong></strong>}{''}
          {new Date(
            item.updatedAt !== item.createdAt ? item.updatedAt : item.createdAt
            ).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
    </div>
    </Link>
      <div className="note-actions">
        <Link to={`/update/${item._id}`} className="icon-btn">
          <FaEdit className="icon edit-icon" title="Edit" />
        </Link>
        <button onClick={(e) => handleDelete(e, item._id)} className="icon-btn">
          <FaTrash className="icon delete-icon" title="Delete" />
        </button>
      </div>
    </div>
    </div>
  ))}
    </div>
    )}
    </>
  )
}

export default HomePage
