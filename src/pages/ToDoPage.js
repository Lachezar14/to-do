import React, { useState } from "react";
import { useGlobalState, GlobalState } from "../context/GlobalState.js";
import {
    Container,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import _ from "lodash";

const TodoPage = () => {
    // Access the global TODO list
    const { todos } = useGlobalState();

    // For adding a new TODO
    const [newTodo, setNewTodo] = useState("");

    // For tracking the TODO being edited
    const [editId, setEditId] = useState(null);

    // For the updated TODO text
    const [editText, setEditText] = useState("");

    // For filter selection
    const [filter, setFilter] = useState("all");

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("error");

    // Add a new TODO, ensuring no duplicates with lodash
    const handleAddTodo = () => {
        if (newTodo.trim() === "") return; // Prevent adding empty todos

        const newTodoItem = {
            id: Date.now(), // Unique ID based on timestamp
            text: newTodo,
            completed: false,
        };

        // Check for duplicates
        const isDuplicate = _.some(todos, (todo) => todo.text.toLowerCase() === newTodo.trim().toLowerCase());

        if (isDuplicate) {
            setAlertMessage("Item already exists!");
            setAlertSeverity("error");
            setAlertOpen(true);
            return; // Don't add the new item if it's a duplicate
        }

        // Add the new TODO if it's not a duplicate
        const updatedTodos = [...todos, newTodoItem];

        GlobalState.set({
            todos: updatedTodos,
        });

        setNewTodo(""); // Clear input field

        // Set success message when the item is added
        setAlertMessage("Item successfully added!");
        setAlertSeverity("success");
        setAlertOpen(true);
    };

    // Handle alert close
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    // Delete a TODO
    const handleDeleteTodo = (id) => {
        GlobalState.set({
            todos: todos.filter((todo) => todo.id !== id),
        });
    };

    // Toggle completion status
    const handleToggleComplete = (id) => {
        GlobalState.set({
            todos: todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
        });
    };

    // Start editing a TODO
    const handleEditStart = (id, text) => {
        setEditId(id);
        setEditText(text);
    };

    // Save the edited TODO
    const handleEditSave = () => {
        if (editText.trim() === "") return; // Prevent saving empty todos

        GlobalState.set({
            todos: todos.map((todo) =>
                todo.id === editId ? { ...todo, text: editText } : todo
            ),
        });

        setEditId(null); // Reset edit state
        setEditText("");
    };

    // Handle edit cancellation
    const handleEditCancel = () => {
        setEditId(null);
        setEditText("");
    };

    // Filter todos based on the selected filter with ES6
    const filteredTodos = todos.filter((todo) => {
        if (filter === "completed") return todo.completed;
        if (filter === "uncompleted") return !todo.completed;
        return true; // Show all for "all"
    });

    return (
        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
            <h1>TODO List</h1>

            {/* Add TODO Form */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Add new TODO"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    // Add TODO on Enter key press
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddTodo();
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleAddTodo}>
                    Add
                </Button>
            </div>

            {/* Filter by All/Completed/Uncompleted */}
            <RadioGroup
                row
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ marginBottom: "20px" }}
            >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                <FormControlLabel value="uncompleted" control={<Radio />} label="Uncompleted" />
            </RadioGroup>

            {/* TODO List */}
            <List>
                {filteredTodos.map((todo) => (
                    <ListItem
                        key={todo.id}
                        secondaryAction={
                            // Only show edit/delete icons when not in edit mode
                            editId !== todo.id && (
                                <>
                                    {/* Edit Button */}
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEditStart(todo.id, todo.text)}
                                    >
                                        <Edit />
                                    </IconButton>

                                    {/* Delete Button */}
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteTodo(todo.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </>
                            )
                        }
                    >
                        {/* Checkbox to mark as completed */}
                        <Checkbox
                            edge="start"
                            checked={todo.completed}
                            onChange={() => handleToggleComplete(todo.id)}
                            disabled={editId === todo.id}
                        />

                        {/* Show TODO text or Edit field */}
                        {editId === todo.id ? (
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                width: "100%",
                                alignItems: "center"
                            }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleEditSave();
                                    }}
                                    autoFocus
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEditSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleEditCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <ListItemText
                                primary={todo.text}
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                }}
                            />
                        )}
                    </ListItem>
                ))}
            </List>

            {/* Snackbar Alert */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Alert onClose={handleAlertClose} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TodoPage;
