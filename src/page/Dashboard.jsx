import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";


function Dashboard() {

    // ================================
    // STATE
    // ================================

    const [stats, setStats] = useState({});
    const [user, setUser] = useState({});
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);


    // Animated statistics
    const [animatedStats, setAnimatedStats] = useState({
        TOTAL: 0,
        NEW: 0,
        PROGRESS: 0,
        COMPLETED: 0,
        CORRECTION_REQUIRED: 0,
        REOPENED: 0
    });


    // React Router navigation
    const navigate = useNavigate();


    // ================================
    // CREATE TICKET
    // ================================

    function handleCreateTicket() {

        setCreatingTicket(true);

        setTimeout(() => {

            navigate("/tickets/create");

        }, 700);
    }


    // ================================
    // TOTAL TICKETS
    // ================================

    function handleTotalTickets() {

        navigate("/tickets");
    }


    // ================================
    // NEW TICKETS
    // ================================

    function handleNewTickets() {

        navigate("/tickets?status=NEW");
    }


    // ================================
    // IN PROGRESS TICKETS
    // ================================

    function handleInProgress() {

        navigate("/tickets?status=IN_PROGRESS");
    }


    // ================================
    // COMPLETED TICKETS
    // ================================

    function handleCompleted() {

        navigate("/completed-tickets");
    }


    // ================================
    // CORRECTION REQUIRED
    // ================================

    function handleCorrectionRequired() {

        navigate(
            "/tickets?status=CORRECTION_REQUIRED"
        );
    }


    function handleReopened() {
    navigate("/tickets?status=REOPENED");
    }


    // ================================
    // LOGOUT
    // ================================

    function handleLogout() {

        setLoggingOut(true);

        setTimeout(() => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");

        }, 700);
    }


    // ================================
    // NUMBER ANIMATION
    // ================================

    function animateNumber(key, target) {

    target = Number(target);

    if (target === 0) {
        setAnimatedStats((previous) => ({
            ...previous,
            [key]: 0
        }));

        return;
    }

    let current = 0;

    const interval = setInterval(() => {

        current += 1;

        setAnimatedStats((previous) => ({
            ...previous,
            [key]: current
        }));

        if (current >= target) {
            clearInterval(interval);
        }

    }, 40);
}


    // ================================
    // DASHBOARD DATA LOAD
    // ================================

    useEffect(() => {

        console.log("Dashboard open");


        // Get JWT token
        const token = localStorage.getItem("token");


        // Get logged-in user
        const storedUser = JSON.parse(
            localStorage.getItem("user")
        );


        // Store user information
        setUser(storedUser || {});


        console.log("Token : ", token);


        // ================================
        // GET TICKET STATISTICS
        // ================================

        axios.get(
            "http://localhost:5200/api/tickets/stats",
            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }
            }
        )

        .then((response) => {

            console.log(
                "Stats : ",
                response.data
            );


            // Store statistics
            setStats(response.data);


            // Animate total tickets
            animateNumber(
                "TOTAL",
                response.data.TOTAL || 0
            );


            // Animate new tickets
            animateNumber(
                "NEW",
                response.data.NEW || 0
            );


            // Animate in-progress tickets
            animateNumber(
                "PROGRESS",
                response.data.PROGRESS || 0
            );


            // Animate completed tickets
            animateNumber(
                "COMPLETED",
                response.data.COMPLETED || 0
            );


            // Animate correction required tickets
            animateNumber(
                "CORRECTION_REQUIRED",
                response.data.CORRECTION_REQUIRED || 0
            );


            // Animate reopened tickets
            animateNumber(
                "REOPENED",
                response.data.REOPENED || 0
            );

        })

        .catch((error) => {

            console.log(
                "Dashboard Stats Error : ",
                error
            );

        });

    }, []);


    // ================================
    // JSX
    // ================================

    return (

        <div className="dashboard-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="dashboard-header">


                {/* Dashboard Title */}

                <div className="dashboard-title">

                    <h1>
                        Ticket Management System
                    </h1>

                    <p>
                        
                    </p>

                </div>


                {/* User Information */}

                <div className="dashboard-user">


                    <div className="user-details">

                        <p>
                            {user.username}
                        </p>

                        <span>
                            {user.role}
                        </span>

                    </div>


                    {/* Logout Button */}

                    <button
                        className={`logout-button ${
                            loggingOut
                                ? "logging-out"
                                : ""
                        }`}
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >

                        {loggingOut
                            ? "Logging out..."
                            : "Logout"
                        }

                    </button>

                </div>

            </div>


            {/* =================================
                DASHBOARD TITLE
            ================================= */}

            <div className="dashboard-welcome">

                <h2>
                    Dashboard
                </h2>

            </div>


            {/* =================================
                STAT CARDS
            ================================= */}

            <div className="stats-container">


                {/* =================================
                    TOTAL TICKETS
                ================================= */}

                <div
                    className="stat-card"
                    onClick={handleTotalTickets}
                >

                    <h3>
                        Total Tickets
                    </h3>

                    <p>
                        {animatedStats.TOTAL}
                    </p>

                    <span>
                        View Tickets →
                    </span>

                </div>


                {/* =================================
                    NEW TICKETS
                ================================= */}

                <div
                    className="stat-card"
                    onClick={handleNewTickets}
                >

                    <h3>
                        New Tickets
                    </h3>

                    <p>
                        {animatedStats.NEW}
                    </p>

                    <span>
                        View Tickets →
                    </span>

                </div>


                {/* =================================
                    IN PROGRESS TICKETS
                ================================= */}

                <div
                    className="stat-card"
                    onClick={handleInProgress}
                >

                    <h3>
                        In Progress
                    </h3>

                    <p>
                        {animatedStats.PROGRESS}
                    </p>

                    <span>
                        View Tickets →
                    </span>

                </div>


                {/* =================================
                    COMPLETED TICKETS
                ================================= */}

                <div
                    className="stat-card"
                    onClick={handleCompleted}
                >

                    <h3>
                        Completed Tickets
                    </h3>

                    <p>
                        {animatedStats.COMPLETED}
                    </p>

                    <span>
                        View Completed →
                    </span>

                </div>


                {/* =================================
                    CORRECTION REQUIRED
                ================================= */}

                <div
                    className="stat-card"
                    onClick={handleCorrectionRequired}
                >

                    <h3>
                        Correction Required
                    </h3>

                    <p>
                        {animatedStats.CORRECTION_REQUIRED}
                    </p>

                    <span>
                        View Tickets →
                    </span>

                </div>


{/* =================================
        REOPENED TICKETS
================================= */}

<div
    className="stat-card"
    onClick={handleReopened}
>
    <h3>
        Reopened Tickets
    </h3>

    <p>
        {animatedStats.REOPENED}
    </p>

    <span>
        View Tickets →
    </span>
</div>  

            </div>


            {/* =================================
                CREATE TICKET
                UNIVERSITY ONLY
            ================================= */}

            {user.role === "UNIVERSITY" && (

                <button
                    className={`create-ticket-button ${
                        creatingTicket
                            ? "creating-ticket"
                            : ""
                    }`}
                    onClick={handleCreateTicket}
                    disabled={creatingTicket}
                >

                    <span className="ticket-icon">
                        🎫
                    </span>

                    <span>

                        {creatingTicket
                            ? "Opening..."
                            : "Create Ticket"
                        }

                    </span>

                </button>

            )}


        </div>
    );
}


export default Dashboard;