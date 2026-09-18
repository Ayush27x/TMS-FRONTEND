import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {

    const [stats, setStats] = useState({});

    useEffect(() => {

        console.log("Dashboard open")

        const token = localStorage.getItem("token");

        console.log("Token : ", token);

        axios.get(
            "http://localhost:5200/api/tickets/stats",
            {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((Response) => {
            console.log("Stats", Response.data)

            setStats(Response.data);
        });

    }, []);

    return (
        <div>
            <h1>TMS Dashboard</h1>
            <p>Welcome to TMS</p>
            <br></br>
            <p>Total Tickets : {stats.TOTAL} </p>
            <p>New Tickets : {stats.NEW} </p>
            <p>In_progress Tickets : {stats.PROGRESS} </p>
            <p>Completed Tickets : {stats.COMPLETED} </p>
            <p>Correction_Required Tickets : {stats.CORRECTION_REQUIRED} </p>
        </div>
    );
}

export default Dashboard;