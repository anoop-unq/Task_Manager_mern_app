import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './update.css';
import { FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import toast from 'react-hot-toast';
import { api } from '../Lib/axios'; // Correct axios instance

const Update = () => {
  const [note, setNote] = useState(null);
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false); 
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const updateNote = async () => {
      try {
        const res = await api.get(`/${id}`);
        setNote(res.data);
        setTimeout(() => {
          setShowForm(true);
        }, 500);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      }
    };
    updateNote();
  }, [id]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    await api.delete(`/${id}`);
    toast.success('Task deleted successfully!', {
      icon: '✅',
      style: {
        borderRadius: '8px',
        background: '#fd3838ff',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
    navigate('/home');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value
    }));
  };

  const refresh = (id) => {
    if (note._id === id) {
      setNote({ ...note, title: "", content: "" });
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    const { title, content } = note;
    if (!title || !content) {
      alert("All fields are Required!");
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    await api.put(`/${id}`, note);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);

    toast.success('Task edited!', {
      icon: '✅',
      style: {
        borderRadius: '8px',
        background: '#747474ff',
        color: '#fff',
        fontWeight: 'bold',
      },
    });

    navigate("/home");
  };

  if (!showForm || !note) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading note data...</p>
      </div>
    );
  }

  return (
    <div className="update-note-container">
      <div className='icons-adjust'>
        <Link to="/home">
          <div className="icon" title="Go Back">
            <FaArrowLeft size={24} color="#333" />
          </div>
        </Link>

        <div className="form-title">Update Your Note</div>
        <div className="icon" title="Delete">
          <button onClick={(e) => handleDelete(e, note._id)}>
            <MdDelete size={24} color="red" />
          </button>
        </div>
      </div>

      <input
        type="text"
        name="title"
        value={note.title}
        placeholder="Update title"
        onChange={handleChange}
        className="form-input"
      />

      <textarea
        placeholder="Update description..."
        rows="4"
        className="form-input"
        name="content"
        onChange={handleChange}
        value={note.content}
      ></textarea>

      <div className="status-dropdown-container">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={note.status}
          onChange={handleChange}
          className={`status-select ${note.status?.toLowerCase().replace('-', '') || 'pending'}`}
        >
          <option value="Pending">Pending</option>
          <option value="In-progress">In-Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className='items-adjust'>
        <button onClick={editSubmit} className="form-button">
          {isSaving ? (
            <>
              <span></span> Saving...
            </>
          ) : (
            "💾 Save Changes"
          )}
        </button>

        <button className='icon-btn' onClick={() => refresh(note._id)}>
          <FiRefreshCw className='refresh' />
        </button>
      </div>
    </div>
  );
};

export default Update;
