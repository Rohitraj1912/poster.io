import React, { useState, useEffect, useRef } from "react";
import { List, ListItem, ListItemIcon, Collapse, Button } from "@mui/material";
import Draggable from "react-draggable";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CategoryIcon from "@mui/icons-material/Category";
import GestureIcon from "@mui/icons-material/Gesture";

import "./workspace.css";

const sidebarOptions = [
  {
    icon: InsertDriveFileIcon,
    label: "Template",
    options: ["Template 1", "Template 2", "Template 3"],
  },
  {
    icon: TextFieldsIcon,
    label: "Text",
    options: ["Add Title", "Add Subtitle", "Add Paragraph"],
  },
  {
    icon: CloudUploadIcon,
    label: "Upload",
    options: ["Upload Image"],
  },
  {
    icon: CategoryIcon,
    label: "Shapes",
    options: ["Circle", "Rectangle", "Triangle"],
  },
  {
    icon: GestureIcon,
    label: "Draw",
    options: ["Pencil", "Eraser", "Brush"],
  },
];

const Workspace = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [scale, setScale] = useState(1);
  const [editingText, setEditingText] = useState(null);
  const fileInputRef = useRef(null);
  const textRef = useRef(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  const handleMenuToggle = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const addTextElement = (type) => {
    const textOptions = {
      "Add Title": { text: "Title", className: "title", type: "text" },
      "Add Subtitle": { text: "Subtitle", className: "subtitle", type: "text" },
      "Add Paragraph": { text: "Your text here", className: "paragraph", type: "text" },
    };

    if (textOptions[type]) {
      const newElement = {
        id: Date.now(),
        ...textOptions[type],
        x: 50,
        y: 50,
        nodeRef: { current: null },
      };
      setElements((prevElements) => [...prevElements, newElement]);
      setSelectedElement(newElement.id);
      setEditingText(newElement.id);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      type: "image",
      src: URL.createObjectURL(file),
      width: 200,
      height: 200,
      x: Math.random() * 300,
      y: Math.random() * 300,
      nodeRef: { current: null },
    }));

    setElements((prevElements) => [...prevElements, ...newImages]);
    event.target.value = null;
  };

  const handleSelectElement = (id, e) => {
    e.stopPropagation();
    setSelectedElement(id);
  };

  const handleTextChange = (id, newText) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, text: newText } : el))
    );
  };

  const handleTextDoubleClick = (id, e) => {
    e.stopPropagation();
    setEditingText(id);
  };

  const handleTextBlur = () => {
    setEditingText(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (textRef.current && !textRef.current.contains(e.target)) {
        setEditingText(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedElement !== null && !editingText) {
        setElements((prevElements) => prevElements.filter((el) => el.id !== selectedElement));
        setSelectedElement(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement, editingText]);

  return (
    <div className="workspace">
      {/* Sidebar */}
      <div className="sidebar">
        <List className="sidebar-list">
          {sidebarOptions.map(({ icon: Icon, options }, index) => (
            <div key={index} className="sidebar-group">
              <ListItem button className="sidebar-item" onClick={() => handleMenuToggle(index)}>
                <ListItemIcon className="sidebar-icon">
                  <Icon fontSize="large" />
                </ListItemIcon>
              </ListItem>

              <Collapse in={activeMenu === index} timeout="auto" unmountOnExit>
                <List className="submenu">
                  {options.map((option, subIndex) => (
                    <ListItem
                      button
                      key={subIndex}
                      className="submenu-item"
                      onClick={() => (option === "Upload Image" ? fileInputRef.current.click() : addTextElement(option))}
                    >
                      {option}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <div className="zoom-controls">
          <Button onClick={handleZoomOut}>-</Button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <Button onClick={handleZoomIn}>+</Button>
        </div>

        <div className="canvas" style={{ transform: `scale(${scale})` }}>
          <h2>Design Your Poster Here</h2>

          {elements.map((el) => (
            <Draggable
              key={el.id}
              nodeRef={el.nodeRef}
              defaultPosition={{ x: el.x, y: el.y }}
              disabled={editingText === el.id}
              onStop={(e) => handleSelectElement(el.id, e)}
            >
              {el.type === "image" ? (
                <div
                  ref={el.nodeRef}
                  className={`draggable-element ${selectedElement === el.id ? "selected" : ""}`}
                  onClick={(e) => handleSelectElement(el.id, e)}
                  style={{ position: "absolute", width: el.width, height: el.height }}
                >
                  <img
                    src={el.src}
                    alt="Uploaded"
                    draggable={false}
                    style={{ width: "100%", height: "100%", cursor: "move" }}
                  />
                </div>
              ) : (
                <div 
                  ref={el.nodeRef}
                  className={`draggable-text ${selectedElement === el.id ? "selected" : ""}`}
                  onClick={(e) => handleSelectElement(el.id, e)}
                  onDoubleClick={(e) => handleTextDoubleClick(el.id, e)}
                >
                  {editingText === el.id ? (
                    <textarea
                      ref={textRef}
                      value={el.text}
                      onChange={(e) => handleTextChange(el.id, e.target.value)}
                      onBlur={handleTextBlur}
                      onKeyDown={handleKeyDown}
                      className={`editable-text ${el.className}`}
                      autoFocus
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        resize: 'both',
                        minWidth: '100px',
                        minHeight: '20px',
                        overflow: 'hidden'
                      }}
                    />
                  ) : (
                    <div className={`editable-text ${el.className}`}>
                      {el.text}
                    </div>
                  )}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workspace;