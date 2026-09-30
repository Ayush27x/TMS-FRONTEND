// =============================
// IMPORTS
// =============================

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompletedTicket.css";


// =============================
// COMPLETED TICKETS COMPONENT
// =============================

function CompletedTicket() {

    // =============================
    // NAVIGATION
    // =============================

    const navigate = useNavigate();


    // =============================
    // SEARCH & FILTER STATES
    // =============================

    // Search by ticket number
    const [ticketNumber, setTicketNumber] = useState("");

    // Filter by document type
    const [documentType, setDocumentType] = useState("");

    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =============================
    // TICKET DATA
    // =============================

    // Store completed tickets
    const [tickets, setTickets] = useState([]);


    // =============================
    // PAGINATION STATES
    // =============================

    // Current page number
    const [page, setPage] = useState(1);

    // Total pages received from backend
    const [totalPages, setTotalPages] = useState(1);

    // Number of tickets displayed per page
    const limit = 10;


    // =============================
    // SEARCH TRIGGER
    // =============================

    /*
        This state is used to manually
        trigger the API request when
        Search button is clicked.
    */
    const [searchTrigger, setSearchTrigger] = useState(0);


    // =============================
    // GET COMPLETED TICKETS
    // =============================

useEffect(() => {
    const fetchCompletedTickets = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5200/api/tickets",
                {
                    params: {
                        status: "COMPLETED",
                        ticket_number: ticketNumber,
                        document_type: documentType,
                        page,
                        limit,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTickets(response.data.tickets);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching completed tickets:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load completed tickets."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchCompletedTickets();
}, [page, searchTrigger]);


    // =============================
    // HANDLE SEARCH
    // =============================

    function handleSearch() {

        // Whenever a new search is performed,
        // start again from page 1
        setPage(1);


        // Trigger API request
        setSearchTrigger((prev) => prev + 1);
    }


    // =============================
    // JSX
    // =============================

    return (

    <div className="completed-tickets-page">


        {/* =================================
            PAGE HEADER
        ================================= */}

        <div className="completed-tickets-header">

            <div>

                <h1>
                    Completed Tickets
                </h1>

                <p>
                    View and manage completed tickets
                </p>

            </div>


            {/* Active Tickets Button */}
            <button
                className="active-tickets-button"
                onClick={() =>
                    navigate("/tickets")
                }
            >
                Active Tickets
            </button>

        </div>


        {/* =================================
            SEARCH & FILTER SECTION
        ================================= */}

        <div className="completed-filter-card">

            <div className="completed-filter-header">

                <h2>
                    Search & Filter
                </h2>

                <p>
                    Find completed tickets using the available filters
                </p>

            </div>


            <div className="completed-filter-form">


                {/* Ticket Number */}
                <div className="completed-filter-group">

                    <label>
                        Ticket Number
                    </label>

                    <input
                        type="text"
                        placeholder="Enter ticket number"
                        value={ticketNumber}
                        onChange={(e) =>
                            setTicketNumber(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* Document Type */}
                <div className="completed-filter-group">

                    <label>
                        Document Type
                    </label>

                    <input
                        type="text"
                        placeholder="Enter document type"
                        value={documentType}
                        onChange={(e) =>
                            setDocumentType(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* Search Button */}
                <button
                    className="completed-search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>

        </div>


        {/* =================================
            COMPLETED TICKETS TABLE
        ================================= */}

        <div className="completed-table-card">


            {/* Table Header */}
            <div className="completed-table-header">

                <div>

                    <h2>
                        Completed Ticket List
                    </h2>

                    <p>
                        All successfully completed tickets
                    </p>

                </div>

            </div>


            {/* Table Wrapper */}
            <div className="completed-table-wrapper">

                <table className="completed-tickets-table">

                    <thead>

                        <tr>

                            <th>
                                Ticket Number
                            </th>

                            <th>
                                Document Type
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


<tbody>
    {loading ? (
        <tr>
            <td colSpan="4" className="completed-loading">
                Loading completed tickets...
            </td>
        </tr>
    ) : error ? (
        <tr>
            <td colSpan="4" className="completed-error">
                {error}
            </td>
        </tr>
    ) : tickets.length > 0 ? (
        tickets.map((ticket) => (
            <tr key={ticket.id}>
                <td>
                    <span className="completed-ticket-number">
                        {ticket.ticket_number}
                    </span>
                </td>

                <td>{ticket.document_type}</td>

                <td>
                    <span className="completed-status-badge">
                        {ticket.status}
                    </span>
                </td>

                <td>
                    <button
                        className="completed-view-button"
                        onClick={() =>
                            navigate(`/tickets/${ticket.id}`)
                        }
                    >
                        View
                    </button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td
                colSpan="4"
                className="completed-no-tickets"
            >
                No completed tickets found.
            </td>
        </tr>
    )}
</tbody>

                </table>

            </div>

        </div>


        {/* =================================
            PAGINATION
        ================================= */}

        <div className="completed-pagination">


            {/* Previous Button */}
            <button
                className="completed-pagination-button"
                onClick={() =>
                    setPage(page - 1)
                }
                disabled={page === 1}
            >
                ← Previous
            </button>


            {/* Page Information */}
            <div className="completed-pagination-info">

                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>

            </div>


            {/* Next Button */}
            <button
                className="completed-pagination-button"
                onClick={() =>
                    setPage(page + 1)
                }
                disabled={page === totalPages}
            >
                Next →
            </button>

        </div>

    </div>
);
}


// =============================
// EXPORT COMPONENT
// =============================

export default CompletedTicket;