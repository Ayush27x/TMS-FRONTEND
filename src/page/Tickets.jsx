import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tickets() {

    // =========================
    // Search and Filter States
    // =========================

    const [ticketNumber, setTicketNumber] = useState("");
    const [studentName, setStudentName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [status, setStatus] = useState("");


    // =========================
    // Pagination States
    // =========================

    // Current page number
    const [page, setPage] = useState(1);

    // Total pages received from backend
    const [totalPages, setTotalPages] = useState(1);

    // Tickets per page
    const [limit] = useState(10);


    const [searchTrigger, setSearchTrigger] = useState(0);


    // =========================
    // Tickets State
    // =========================

    const [tickets, setTickets] = useState([]);


    // =========================
    // Navigation
    // =========================

    const navigate = useNavigate();


    // =========================
    // Search Button
    // =========================

    function handleSearch() {

        // Whenever a new search is performed,
        // start from page 1
        setPage(1);
        setSearchTrigger(searchTrigger + 1);
    }


    // =========================
    // Get Tickets API
    // =========================

    useEffect(() => {

        const token = localStorage.getItem("token");

        axios.get(
            "http://localhost:5200/api/tickets",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },

                // Send filters + pagination
                // as query parameters
                params: {
                    ticket_number: ticketNumber,
                    student_name: studentName,
                    roll_number: rollNumber,
                    status: status,
                    page: page,
                    limit: limit
                }
            }
        )
        .then((response) => {

            console.log("Tickets:", response.data);

            // Store tickets in state
            setTickets(response.data.tickets);

            // Store total number of pages
            setTotalPages(
                response.data.pagination.totalPages
            );

        });

    }, [
        page, searchTrigger
    ]);
    

    return (

        <div>

            {/* =========================
                Search and Filter UI
            ========================= */}

            <div>

                {/* Ticket Number */}
                <input
                    type="text"
                    placeholder="Ticket Number"
                    value={ticketNumber}
                    onChange={(e) =>
                        setTicketNumber(e.target.value)
                    }
                />


                {/* Student Name */}
                <input
                    type="text"
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) =>
                        setStudentName(e.target.value)
                    }
                />


                {/* Roll Number */}
                <input
                    type="text"
                    placeholder="Roll Number"
                    value={rollNumber}
                    onChange={(e) =>
                        setRollNumber(e.target.value)
                    }
                />


                {/* Status */}
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >

                    <option value="">
                        ALL STATUS
                    </option>

                    <option value="NEW">
                        NEW
                    </option>

                    <option value="IN_PROGRESS">
                        IN PROGRESS
                    </option>

                    <option value="COMPLETED">
                        COMPLETED
                    </option>

                    <option value="CORRECTION_REQUIRED">
                        CORRECTION REQUIRED
                    </option>

                </select>


                {/* Search Button */}
                <button onClick={handleSearch}>
                    Search
                </button>

            </div>


            {/* =========================
                Tickets Table
            ========================= */}

            <h1>Tickets</h1>

            <table border="1">

                <thead>

                    <tr>
                        <th>Ticket Number</th>
                        <th>Form Number</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>


                <tbody>

                    {tickets.map((ticket) => (

                        <tr key={ticket.id}>

                            <td>
                                {ticket.ticket_number}
                            </td>

                            <td>
                                {ticket.form_number}
                            </td>

                            <td>
                                {ticket.student_name}
                            </td>

                            <td>
                                {ticket.roll_number}
                            </td>

                            <td>
                                {ticket.status}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/tickets/${ticket.id}`
                                        )
                                    }
                                >
                                    View
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            <br />


            {/* =========================
                Pagination
            ========================= */}

            <div>

                {/* Previous Button */}

                <button
                    onClick={() =>
                        setPage(page - 1)
                    }

                    disabled={page === 1}
                >
                    Previous
                </button>


                {/* Current Page */}

                <span>
                    {" "} Page {page} of {totalPages} {" "}
                </span>


                {/* Next Button */}

                <button
                    onClick={() =>
                        setPage(page + 1)
                    }

                    disabled={page === totalPages}
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default Tickets;