import React, { useState, useRef, useEffect } from "react";
import { List, ListItem, ListItemIcon, Collapse, Button } from "@mui/material";
import Draggable from "react-draggable";

// Icons
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // Template
import TextFieldsIcon from "@mui/icons-material/TextFields"; // Text
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Upload
import CategoryIcon from "@mui/icons-material/Category"; // Shapes
import GestureIcon from "@mui/icons-material/Gesture"; // Draw

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
    options: ["Upload Image", "Upload SVG", "Upload PDF"],
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

  // Zoom State
  const [scale, setScale] = useState(1);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  // Handle Sidebar Click
  const handleMenuToggle = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  // Add Text Element
  const addTextElement = (type) => {
    const textOptions = {
      "Add Title": { text: "Title", fontSize: 32 },
      "Add Subtitle": { text: "Subtitle", fontSize: 24 },
      "Add Paragraph": { text: "Your text here", fontSize: 18 },
    };

    if (textOptions[type]) {
      setElements([
        ...elements,
        { id: Date.now(), ...textOptions[type], x: 50, y: 50, nodeRef: React.createRef(), isEditing: false },
      ]);
    }
  };

  // Handle text selection
  const handleSelectElement = (id) => {
    setSelectedElement(id);
  };

  // Handle text change
  const handleTextChange = (id, newText) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, text: newText } : el)));
  };

  // Handle keypress for delete functionality
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedElement !== null) {
        setElements(elements.filter((el) => el.id !== selectedElement));
        setSelectedElement(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, elements]);

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

              {/* Submenu */}
              <Collapse in={activeMenu === index} timeout="auto" unmountOnExit>
                <List className="submenu">
                  {options.map((option, subIndex) => (
                    <ListItem button key={subIndex} className="submenu-item" onClick={() => addTextElement(option)}>
                      {option}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        {/* Zoom Controls */}
        <div className="zoom-controls">
          <Button onClick={handleZoomOut}>-</Button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <Button onClick={handleZoomIn}>+</Button>
        </div>

        {/* A4 Canvas */}
        <div className="canvas" style={{ transform: `scale(${scale})` }}>
          <h2>Design Your Poster Here</h2>

          {/* Draggable Text Elements */}
          {elements.map((el) => (
            <Draggable
              key={el.id}
              nodeRef={el.nodeRef}
              defaultPosition={{ x: el.x, y: el.y }}
              onStop={() => setSelectedElement(el.id)}
            >
              <div
                ref={el.nodeRef}
                className={`draggable-text ${selectedElement === el.id ? "selected" : ""}`}
                onClick={() => handleSelectElement(el.id)}
              >
                <input
                  type="text"
                  value={el.text}
                  onChange={(e) => handleTextChange(el.id, e.target.value)}
                  className="editable-text"
                />
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
