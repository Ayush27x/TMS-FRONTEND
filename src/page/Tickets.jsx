// =============================
// IMPORTS
// =============================

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,
        useSearchParams
 } from "react-router-dom";
import "./Tickets.css";


// =============================
// TICKETS COMPONENT
// =============================

function Tickets() {

    // =============================
    // SEARCH & FILTER STATES
    // =============================

    // Search by ticket number
    const [ticketNumber, setTicketNumber] = useState("");

    // Filter by document type
    const [documentType, setDocumentType] = useState("");

    // Filter by ticket status
    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage]= useState("");


    // Get logged-in user's role
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role;

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
    // TICKET DATA
    // =============================

    // Store tickets received from backend
    const [tickets, setTickets] = useState([]);


    // =============================
    // SEARCH TRIGGER
    // =============================

    /*
        This state is used to manually trigger
        the API call when the Search button
        is clicked.
    */
    const [searchTrigger, setSearchTrigger] = useState(0);


    // =============================
    // NAVIGATION
    // =============================

    const navigate = useNavigate();


    //Search query parameter from URL
    const [searchParams] = useSearchParams();

    // Read status filter from URL
    const dashboardStatus = searchParams.get("status");


    // =============================
    // HANDLE SEARCH
    // =============================

    function handleSearch() {

        // Whenever a new search is performed,
        // start again from page 1
        setPage(1);

        // Change searchTrigger so that
        // useEffect runs again
        setSearchTrigger((prev) => prev + 1);
    }


    // Handle clear filter
    function handleClearFilters() {
        
        // Clear ticket number ();
        setTicketNumber("")

        // Clear document type filter
        setDocumentType("");

        // Reset status filter
        setStatus("");

        // Go back to first search
        setPage(1);

        // Trigger fresh API request
        setSearchTrigger((prev) => prev + 1);

    }


    // =============================
    // GET TICKETS FROM BACKEND
    // =============================

    useEffect(() => {

        // Get JWT token from localStorage
        const token = localStorage.getItem("token");

        const effectiveStatus = dashboardStatus || status;

        //Start Loading
        setLoading(true);

        //Clear previous error
        setErrorMessage("");


        // Call Tickets API
        axios.get(
            "http://localhost:5200/api/tickets",
            {
                // Send authentication token
                headers: {
                    Authorization: `Bearer ${token}`
                },

                // Send filters and pagination
                // as query parameters
                params: {
                    ticket_number: ticketNumber,
                    document_type: documentType,
                    status: effectiveStatus,
                    page: page,
                    limit: limit
                }
            }
        )
            .then((response) => {

                console.log(
                    "Tickets:",
                    response.data
                );


                // Store tickets received from backend
                setTickets(
                    response.data.tickets
                );


                // Store total number of pages
                setTotalPages(
                    response.data.pagination.totalPages
                );

            })
            .catch((error) => {

                //Log API Error 
                console.log("Ticket API Error : ",error);

                setErrorMessage(
                    error.response?.data?.message || 
                    "Failed to load tickets"
                );

                // Clear ticket if API fails 
                setTickets([]);
            })
            .finally(() => {

                //Stop loading after API request
                // Success or fails
                setLoading(false);

            });

    }, [
        page,
        searchTrigger,
        dashboardStatus
    ]);


    // =============================
    // JSX
    // ============================= 

    return (

    <div className="tickets-page">


        {/* =================================
            PAGE HEADER
        ================================= */}

        <div className="tickets-header">

            <div>

                <h1>
                    Tickets
                </h1>

                <p>
                    Manage and track all tickets
                </p>

            </div>


            {/* Header Action Buttons */}
            <div className="tickets-header-actions">

                {userRole === "UNIVERSITY" && (

            <button
                className="create-ticket-button"
                onClick={() =>
                navigate("/tickets/create")
                }
            >
                + Create Ticket
            </button>

            )}

                <button
                    className="completed-tickets-button"
                    onClick={() =>
                        navigate("/completed-tickets")
                    }
                >
                    Completed Tickets
                </button>

                <button
                    className="completed-tickets-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Dashboard
                </button>

            </div>

        </div>


        {/* =================================
            SEARCH & FILTER SECTION
        ================================= */}

        <div className="tickets-filter-card">

            <div className="filter-header">

                <h2>
                    Search & Filter
                </h2>

                <p>
                    Find tickets using the available filters
                </p>

            </div>


            <div className="tickets-filter-form">


                {/* Ticket Number */}
                <div className="filter-group">

                    <label>
                        Ticket Number
                    </label>

                    <input
                        type="text"
                        placeholder="Enter ticket number"
                        value={ticketNumber}
                        onChange={(e) =>
                            setTicketNumber(e.target.value)
                        }
                    />

                </div>


                {/* Document Type */}
                <div className="filter-group">

                    <label>
                        Document Type
                    </label>

                    <input
                        type="text"
                        placeholder="Enter document type"
                        value={documentType}
                        onChange={(e) =>
                            setDocumentType(e.target.value)
                        }
                    />

                </div>


                {/* Status */}
                <div className="filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="NEW">
                            New
                        </option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CORRECTION_REQUIRED">
                            Correction Required
                        </option>

                        <option value="REOPENED">
                            Reopened
                        </option>



                    </select>

                </div>


                {/* Search Button */}
                <button
                    className="ticket-search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

                {/* Clear Filters Button */}
                <button
                    className="clear-filters-button"
                    onClick={handleClearFilters}
                >
                    Clear
                </button>   

            </div>

        </div>


        {/* =================================
            TICKETS TABLE SECTION
        ================================= */}

        <div className="tickets-table-card">

            <div className="tickets-table-header">

                <div>

                    <h2>
                        Ticket List
                    </h2>

                    <p>
                        View and manage submitted tickets
                    </p>

                </div>

            </div>


            {/* Tickets Table */}
            <div className="tickets-table-wrapper">

                <table className="tickets-table">

                    <thead>

                        <tr>

                            <th>
                                Ticket Number
                            </th>

                            <th>
                                Form Number
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

    // =============================
    // LOADING STATE
    // =============================

    <tr>

        <td
            colSpan="4"
            className="tickets-loading"
        >
            Loading tickets...
        </td>

    </tr>

) : errorMessage ? (

    // =============================
    // ERROR STATE
    // =============================

    <tr>

        <td
            colSpan="4"
            className="tickets-error"
        >
            ⚠ {errorMessage}
        </td>

    </tr>

) : tickets.length > 0 ? (

    // =============================
    // TICKETS LIST
    // =============================

    tickets.map((ticket) => (

        <tr key={ticket.id}>

            {/* Ticket Number */}
            <td>

                <span className="ticket-number">
                    {ticket.ticket_number}
                </span>

            </td>


            {/* Form Number */}
            <td>
                {ticket.form_number}
            </td>


            {/* Status */}
            <td>

                <span
                    className={`ticket-status ${ticket.status.toLowerCase()}`}
                >
                    {ticket.status}
                </span>

            </td>


            {/* View Button */}
            <td>

                <button
                    className="view-ticket-button"
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

    ))

) : (

    // =============================
    // EMPTY STATE
    // =============================

    <tr>

        <td
            colSpan="4"
            className="no-tickets"
        >
            No tickets found.
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

        <div className="tickets-pagination">


            {/* Previous Button */}
            <button
                className="pagination-button"
                onClick={() =>
                    setPage(page - 1)
                }
                disabled={page === 1}
            >
                ← Previous
            </button>


            {/* Page Information */}
            <div className="pagination-info">

                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>

            </div>


            {/* Next Button */}
            <button
                className="pagination-button"
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

export default Tickets;