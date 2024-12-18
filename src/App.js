import React, { useState } from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";

// State Management
import { GlobalStateProvider } from "./context/GlobalState";

// Material-UI Components
import {
    Container,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {Menu, LocalFlorist, Close, Ballot} from "@mui/icons-material";
import { Link } from "react-router-dom";

// Page Components
import TodoPage from "./pages/ToDoPage";
import OtherPage from "./pages/OtherPage";

// Sidebar Component
const SidebarContent = ({ onClose }) => (
    <List>
        <ListItem
            button
            component={Link}
            to="/todo"
            onClick={onClose}
        >
            <Ballot />
            <ListItemText primary="TODO List" />
        </ListItem>
        <ListItem
            button
            component={Link}
            to="/lorem"
            onClick={onClose}
        >
            <LocalFlorist />
            <ListItemText primary="Lorem Ipsum" />
        </ListItem>
    </List>
);


// Main App Component
const App = () => {
    // Mobile drawer state management
    const [mobileOpen, setMobileOpen] = useState(false);

    // Responsive design check
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Drawer toggle handler
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <GlobalStateProvider>
            <Router>
                {/* App Header */}
                <AppBar position="sticky">
                    <Toolbar>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                {mobileOpen ? <Close /> : <Menu />}
                            </IconButton>
                        )}
                        <h1 style={{ flexGrow: 1 }}>My TODO App</h1>
                    </Toolbar>
                </AppBar>

                {/* Main Layout with Responsive Drawer */}
                <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
                    {/* Mobile Drawer (Temporary) */}
                    {isMobile ? (
                        <Drawer
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Keeps it in the DOM, quicker when toggling on and off
                            }}
                            sx={{
                                '& .MuiDrawer-paper': {
                                    width: 240,
                                    boxSizing: 'border-box'
                                },
                            }}
                        >
                            <SidebarContent onClose={handleDrawerToggle} />
                        </Drawer>
                    ) : (
                        // Desktop Drawer (Permanent)
                        <Drawer
                            sx={{
                                width: 240,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: 240,
                                    boxSizing: 'border-box',
                                },
                            }}
                            variant="permanent"
                            anchor="left"
                        >
                            <SidebarContent onClose={() => {}} />
                        </Drawer>
                    )}

                    {/* Content Area */}
                    <Container
                        maxWidth="lg"
                        style={{
                            flexGrow: 1,
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: isMobile ? 0 : 20, // Adjust for desktop drawer
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Navigate to="/todo" />} />
                            <Route path="/todo" element={<TodoPage />} />
                            <Route path="/lorem" element={<OtherPage />} />
                        </Routes>
                    </Container>
                </div>
            </Router>
        </GlobalStateProvider>
    );
};

export default App;