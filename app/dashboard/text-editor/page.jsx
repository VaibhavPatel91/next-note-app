"use client";
import { useState, useRef } from "react";

export default function TextEditor() {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  let recognition;


  // Initialize SpeechRecognition
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Continue recognition even after pauses
    recognition.interimResults = false; // Get final results only
    recognition.lang = 'en-US'; // Set language to English (you can change this as needed)

    recognition.onresult = (event) => {
      let transcript = event.results[event.results.length - 1][0].transcript;

      // Insert the speech text at the current cursor position
      document.execCommand('insertText', false, transcript);

      // Update the editor content
      handleInputChange();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false); // Stop recording when speech recognition ends
    };
  }


  // Function to handle formatting commands
  const handleCommand = (command) => {
    document.execCommand(command, false, null);
  };

  // Function to insert a new paragraph with tab space
  const insertNewParagraph = () => {
    const editor = editorRef.current;

    // Create a new paragraph element
    const newParagraph = document.createElement("p");

    // Add non-breaking spaces for tab (you can adjust the number of spaces)
    newParagraph.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";

    // Insert the paragraph at the caret position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents(); // Delete any selected content
    range.insertNode(newParagraph); // Insert the new paragraph

    // Create a new range to place the cursor inside the new paragraph
    const newRange = document.createRange();
    newRange.setStart(newParagraph, 1); // Set the cursor after the tab space
    newRange.collapse(true);

    // Remove old selection and apply the new range
    selection.removeAllRanges();
    selection.addRange(newRange);

    // Move focus to the editor
    editor.focus();

    // Update content
    handleInputChange();
  };

  // Function to handle starting/stopping speech recognition
  const toggleSpeechToText = () => {
    if (isRecording) {
      recognition.stop(); // Stop recording if already started
    } else {
      recognition.start(); // Start speech recognition
      setIsRecording(true);
    }
  };

  // Function to handle content change
  const handleInputChange = () => {
    setContent(editorRef.current.innerHTML);
  };

  return (
    <div className="p-4 bg-slate-800 min-h-screen text-white">
      {/* Toolbar for formatting */}
      <div className="mb-4 space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleCommand("bold")}
        >
          Bold
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleCommand("italic")}
        >
          Italic
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleCommand("underline")}
        >
          Underline
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleCommand("insertOrderedList")}
        >
          OL
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleCommand("insertUnorderedList")}
        >
          UL
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleCommand("createLink", prompt("Enter a URL:"))}
        >
          Insert Link
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={insertNewParagraph}
        >
          New Paragraph
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={toggleSpeechToText}
        >
          {isRecording ? 'Stop Speech to Text' : 'Start Speech to Text'}
        </button>
      </div>

      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInputChange}
        className="border border-slate-600 p-4 min-h-[200px] rounded bg-slate-700 text-white focus:outline-none"
      >
        <p>Edit your text here...</p>
      </div>

      {/* Preview the content */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Preview:</h3>
        <div
          className="p-4 bg-slate-700 rounded border border-slate-600"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}