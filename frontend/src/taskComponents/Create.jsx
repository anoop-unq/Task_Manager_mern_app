import React, { useState } from 'react';
import './create.css';
import { MdEditNote } from 'react-icons/md';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa'
import toast from 'react-hot-toast';
import {api} from '../Lib/axios';

const Create = () => {
  const [data,setData] = useState({
    title:"",
    content:"",
    status:"Pending"
  })
  const navigate = useNavigate()
  const handleChange = (e)=>{
    const name = e.target.name
    const value = e.target.value
   setData((prev) => ({
    ...prev,
    [name]: value,
  }));
  }
  const submitData = async(e)=>{
    e.preventDefault()
    const {title,content,status} = data
    if(!title || !content || !status){
      return alert("All fields are required !")
    }
     await api.post('/', {
      title,
      content,
      status,
    }
)
  toast.success('Task added successfully !', {
  icon: '✅',
  style: {
    borderRadius: '8px',
    background: '#4BB543',
    color: '#fff',
    fontWeight: 'bold',
  },
});
    navigate("/home")
 
        setData({
      title: "",
      content: "",
      status: "Pending"
    });
  }
 
  return (
    
    <div className="taskboard-wrapper">
      
      <div className="taskboard-container">
        <div className="taskboard-left">
           <Link to="/home">
            <div className="icon" title="Go Back">
            <FaArrowLeft size={24} color="#333" />
          </div>
          </Link>
          <h2 className="taskboard-heading">Welcome to TaskBoard</h2>
          <p className="taskboard-description">
            Create, update, and manage your tasks effortlessly. Stay productive and organized every day.
          </p>
          <div className="taskboard-image">
            <MdEditNote className="note-icon" />
          </div>
        </div>

        <div className="taskboard-form-container">
          <h2 className="form-title">Create a Task</h2>
          <form className="task-form" onSubmit={submitData}>
            <input
              type="text"
              placeholder="Enter title"
              className="form-input"
              name='title'
              onChange={handleChange}
              value={data.title}
            />
            <textarea
              placeholder="Enter description..."
              rows="4"
              className="form-textarea"
              name='content'
              onChange={handleChange}
              value={data.content}
            ></textarea>
            <div className="status-dropdown-container">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={handleChange}
                className={`status-select ${data.status?.toLowerCase().replace('-', '') || 'pending'}`}
                  >
                <option value="Pending">Pending</option>
                <option value="In-progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="form-submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
