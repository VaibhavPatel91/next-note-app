"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function NotePage() {
  const router = useRouter();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect if no token
    } else {
      fetchNotes(); // Fetch notes after checking token
    }
  }, [router]);

  // Fetch notes of the logged-in user
  const fetchNotes = async () => {
    const userEmail = localStorage.getItem("userEmail");

    try {
      const response = await fetch(`/api/notes?userEmail=${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data); // Set notes to the state
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Function to handle submitting a new or edited note
  const handleSubmit = async () => {
    const payload = {
      noteTitle: noteTitle,
      noteText: noteContent,
      userEmail: localStorage.getItem("userEmail"),
    };

    try {
      // If editing, send a PUT request to update the note
      if (editingNoteId) {
        const response = await fetch(`/api/notes?id=${editingNoteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setEditingNoteId(null); // Reset the editing state
          setIsModalOpen(false);
        } else {
          const errorData = await response.json();
          console.error("Error updating note:", errorData.error);
        }
      } else {
        // If not editing, create a new note
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setIsModalOpen(false);
        } else {
          const errorData = await response.json();
          console.error("Error creating note:", errorData.error);
        }
      }

      // Clear input fields after save or update
      setNoteTitle("");
      setNoteContent("");
      fetchNotes(); // Fetch notes again to update the list
    } catch (error) {
      console.error("Failed to submit note:", error);
    }
  };

  // Function to handle editing a note
  const handleEdit = (note) => {
    setIsModalOpen(true);
    setNoteTitle(note.noteTitle); // Pre-fill the title field
    setNoteContent(note.noteText); // Pre-fill the content field
    setEditingNoteId(note._id); // Set the note ID for editing
  };

  // Delete note function
  const handleDelete = async (noteId) => {
    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchNotes(); // Refresh the notes list after deletion
      } else {
        const errorData = await response.json();
        console.error("Error deleting note:", errorData.error);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };
  return (
    <main className="p-4 bg-slate-800 min-h-screen">
      <div className=" mx-auto">
        {/* Add Note Button */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Add Note
        </button>

        {/* Modal (Pop-up) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-700 p-6 rounded-lg shadow-lg text-white max-w-lg w-full">
              <h2 className="text-xl mb-4">Add New Note</h2>
              <input
                type="text"
                name="noteTitle"
                placeholder="Enter Your Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full p-2 mb-2 text-white bg-slate-600 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="noteContent"
                placeholder="Enter Your Note Content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full p-2 text-white bg-slate-600 rounded outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="p-4 bg-slate-700 rounded-lg text-white shadow-lg break-inside-avoid"
            >
              <h3 className="text-lg font-semibold">{note.noteTitle}</h3>
              <p className="mt-2">{note.noteText}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default NotePage;
