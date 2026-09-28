import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const [stats, setStats] = useState({});
    const [user, setUser] = useState({});
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [animatedStats, setAnimatedStats] = useState({
        TOTAL: 0,
        NEW: 0,
        PROGRESS: 0,
        COMPLETED: 0,
        CORRECTION_REQUIRED: 0
    });

    const navigate = useNavigate();


    // Create Ticket
    function handleCreateTicket() {

        setCreatingTicket(true);

        setTimeout(() => {
            navigate("/tickets/create");
        }, 700);
    }


    // Total Tickets
    function handleTotalTickets() {
        navigate("/tickets");
    }


    // New Tickets
    function handleNewTickets() {
        navigate("/tickets?status=NEW");
    }


    // In Progress Tickets
    function handleInProgress() {
        navigate("/tickets?status=IN_PROGRESS");
    }


    // Completed Tickets
    function handleCompleted() {
        navigate("/completed-tickets");
    }


    // Correction Required Tickets
    function handleCorrectionRequired() {
        navigate("/tickets?status=CORRECTION_REQUIRED");
    }


    // Logout
    function handleLogout() {
        
        setLoggingOut(true);

        setTimeout(() => {
            
            localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        })

        
    }


    // Number Animation
    function animateNumber(key, target) {

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


    // Dashboard data load
    useEffect(() => {

        console.log("Dashboard open");

        const token = localStorage.getItem("token");

        const storedUser = JSON.parse(
            localStorage.getItem("user")
        );

        setUser(storedUser);

        console.log("Token : ", token);


        axios.get(
            "http://localhost:5200/api/tickets/stats",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {

            console.log("Stats : ", response.data);

            setStats(response.data);

            animateNumber(
                "TOTAL",
                response.data.TOTAL || 0
            );

            animateNumber(
                "NEW",
                response.data.NEW || 0
            );

            animateNumber(
                "PROGRESS",
                response.data.PROGRESS || 0
            );

            animateNumber(
                "COMPLETED",
                response.data.COMPLETED || 0
            );

            animateNumber(
                "CORRECTION_REQUIRED",
                response.data.CORRECTION_REQUIRED || 0
            );

        })
        .catch((error) => {

            console.log(
                "Dashboard Stats Error : ",
                error
            );

        });

    }, []);


    return (

        <div className="dashboard-page">


            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div className="dashboard-title">

                    <h1>Ticket Management System</h1>

                    <p>
                        
                    </p>

                </div>


                <div className="dashboard-user">

                    <div className="user-details">

                        <p>
                            {user.username}
                        </p>

                        <span>
                            {user.role}
                        </span>

                    </div>


                    <button
                        className={`logout-button ${
                        loggingOut ? "logging-out" : ""
                            }`}
                        onClick={handleLogout}
                        disabled={loggingOut}
                        >
                            {loggingOut ? "Logging out..." : "Logout"}
                    </button>

                </div>

            </div>


            {/* ================= DASHBOARD TITLE ================= */}

            <div className="dashboard-welcome">

                <h2>
                    Dashboard
                </h2>

            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="stats-container">


                {/* TOTAL TICKETS */}

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


                {/* NEW TICKETS */}

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


                {/* IN PROGRESS TICKETS */}

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


                {/* COMPLETED TICKETS */}

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


                {/* CORRECTION REQUIRED */}

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

            </div>


            {/* ================= CREATE TICKET ================= */}

            <button
                className={`create-ticket-button ${
                    creatingTicket ? "creating-ticket" : ""
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


        </div>
    );
}

export default Dashboard;