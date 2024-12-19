import axios from "axios";
import React, { useEffect, useState } from "react";

function NotesList(props) {
    const [notes, setNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("");
    const [userLast, setLast] = useState("");
    const [editingNote, setEditingNote] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSharedWith, setNewSharedWith] = useState([]);


    const token = localStorage.getItem("token");


    useEffect(() => {
        fetchNotes();
        fetchUsers();
        const storedName = localStorage.getItem("first");
        const storedlast = localStorage.getItem("last");
        if (storedName && storedlast) {
            setUserName(storedName);
            setLast(storedlast);
        }

    }, []);

    const fetchNotes = async () => {

        try {
            const resp = await axios.get('https://notes.devlop.tech/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setNotes(resp.data);
        } catch (err) {
            console.error("Error fetching notes:", err.response ? err.response.data : err.message);
            alert("Failed to fetch notes. Please try again.");
        }
    };
    const fetchUsers = async () => {
        try {
            const resp = await axios.get("https://notes.devlop.tech/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(resp.data);
        } catch (err) {
            console.error("Error fetching users:", err.response?.data || err.message);
            alert("Failed to fetch users. Please try again.");
        }
    };


    const addNote = async () => {
        try {
            const newNote = {
                title: newTitle,
                content: newContent,
                shared_with: newSharedWith,
            };
            const resp = await axios.post("https://notes.devlop.tech/api/notes", newNote, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes([...notes, resp.data]);
            setNewTitle("");
            setNewContent("");
            setNewSharedWith([]);
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding note:", err.response?.data || err.message);
            alert("Failed to add note. Please try again.");
        }
    };


    const delet = async (noteId) => {
        try {

            await axios.delete(`https://notes.devlop.tech/api/notes/${noteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

        } catch (err) {
            console.error("Error deleting note:", err.response ? err.response.data : err.message);
            alert("Failed to delete the note. Please try again.");
        }
    };

    const updateNote = async (noteId, updatedData) => {
        try {
            await axios.put(
                `https://notes.devlop.tech/api/notes/${noteId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId ? { ...note, ...updatedData } : note
                )
            );

        } catch (err) {
            console.error("Error updating note:", err.response ? err.response.data : err.message);
            alert("Failed to update the note. Please try again.");
        }
    };

    const logout = async () => {

        try {
            const resp = await axios.post('https://notes.devlop.tech/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(resp.data);
            localStorage.removeItem('token'); 
            props.setisConect(false);

        }
        catch (err) {
            console.error(err.response?.data || err.message);
        }
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Notes List</h1>
            <h4>Welcome, {userName} {userLast}</h4>
            <div className="mb-3 d-flex justify-content-center">
                <div className="d-flex gap-1">
                    <button className="btn btn-danger" onClick={logout}>Log Out</button>
                    <button className="btn btn-success" onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add New Note"}</button>
                </div>
                {showAddForm && (
                    <div className="custom-card">
                    <h5 className="custom-card-title">Add New Note</h5>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addNote();
                        }}
                    >
                        <div className="custom-form-group">
                            <label htmlFor="newTitle" className="custom-label">
                                Title
                            </label>
                            <input
                                type="text"
                                id="newTitle"
                                className="custom-input"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Enter note title"
                                required
                            />
                        </div>
                        <div className="custom-form-group">
                            <label htmlFor="newContent" className="custom-label">
                                Content
                            </label>
                            <textarea
                                id="newContent"
                                className="custom-textarea"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Enter note content"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="custom-form-group">
                            <label htmlFor="newSharedWith" className="custom-label">
                                Share With
                            </label>
                            <select
                                id="newSharedWith"
                                className="custom-select"
                                value={newSharedWith}
                                onChange={(e) =>
                                    setNewSharedWith(
                                        Array.from(e.target.selectedOptions, (option) => option.value)
                                    )}
                                multiple
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: "#888", fontSize: "14px", marginTop: "5px", display: "block" }}>
                                Hold down the Ctrl (Windows) or Command (Mac) key to select multiple people.
                            </small>
                        </div>
                        <button type="submit" className="custom-button">
                            Save Note
                        </button>
                    </form>
                </div>
                
                )}
            </div>
            {notes.length > 0 ? (
                <table className="custom-table">
                <thead className="custom-table-header">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Shared With</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((note, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>{index + 1}</td>
                                <td>{note.title}</td>
                                <td>
                                    <b>{note.content}</b>
                                    <small style={{ display: "block", color: "#6c757d" }}>
                                        {new Date(note.date).toLocaleDateString("en-GB")}
                                    </small>
                                </td>
                                <td>
                                    {note.shared_with && note.shared_with.length > 0
                                        ? note.shared_with.map((user) => user.first_name).join(", ")
                                        : "Not shared"}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            style={{
                                                backgroundColor: "#28a745",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                color: "#fff",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setEditingNote(note);
                                                setEditTitle(note.title);
                                                setEditContent(note.content);
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: "#dc3545",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                color: "#fff",
                                                marginLeft: "5px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => delet(note.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {editingNote && editingNote.id === note.id && (
                                <tr>
                                    <td colSpan="5">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                updateNote(editingNote.id, { title: editTitle, content: editContent });
                                                setEditingNote(null);
                                            }}
                                        >
                                            <div style={{ marginBottom: "10px" }}>
                                                <label htmlFor="editTitle" style={{ fontWeight: "bold" }}>
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    id="editTitle"
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px",
                                                        margin: "5px 0",
                                                        borderRadius: "5px",
                                                        border: "1px solid #ced4da",
                                                    }}
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                />
                                            </div>
                                            <div style={{ marginBottom: "10px" }}>
                                                <label htmlFor="editContent" style={{ fontWeight: "bold" }}>
                                                    Content
                                                </label>
                                                <textarea
                                                    id="editContent"
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px",
                                                        margin: "5px 0",
                                                        borderRadius: "5px",
                                                        border: "1px solid #ced4da",
                                                        minHeight: "80px",
                                                    }}
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <button
                                                    type="submit"
                                                    style={{
                                                        backgroundColor: "#007bff",
                                                        border: "none",
                                                        padding: "5px 10px",
                                                        borderRadius: "5px",
                                                        color: "#fff",
                                                        cursor: "pointer",
                                                        marginRight: "5px",
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    style={{
                                                        backgroundColor: "#6c757d",
                                                        border: "none",
                                                        padding: "5px 10px",
                                                        borderRadius: "5px",
                                                        color: "#fff",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => setEditingNote(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            
            ) : (
                <p className="text-center text-muted">No notes available.</p>
            )}
        </div>
    );
}

export default NotesList;
