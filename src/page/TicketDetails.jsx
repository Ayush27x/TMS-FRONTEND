// =============================
// IMPORTS
// =============================

import axios from "axios";
import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import "./TicketDetails.css";


// =============================
// TICKET DETAILS COMPONENT
// =============================
function TicketDetails() {

    // Get ticket ID from URL
    const { id } = useParams();


    // Navigation hook
    const navigate = useNavigate();


    // =============================
    // STATE VARIABLES
    // =============================

    // Store complete ticket details
    const [ticket, setTicket] = useState(null);


    // Store ticket history
    const [history, setHistory] = useState([]);


    // Store selected new status
    const [newStatus, setNewStatus] = useState("");


    // Store correction remark
    const [remark, setRemark] = useState("");


    // Store selected marksheet file
    const [file, setFile] = useState(null);


    // Store uploaded attachment details
    const [attachment, setAttachment] = useState(null);


    // Store logged-in user's role
    const [userRole, setUserRole] = useState("");


    // Status update loading state
    const [updatingStatus, setUpdatingStatus] = useState(false);


    // Success message
    const [successMessage, setSuccessMessage] = useState("");


    // Error message
    const [errorMessage, setErrorMessage] = useState("");



    // =============================
    // FORMAT DATE & TIME
    // =============================



function formatDateTime(dateTime) {

    return new Date(dateTime).toLocaleString("en-IN", {

        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}


    // =============================
    // HANDLE MARKSHEET UPLOAD
    // ============================
    async function handleUpload() {


        // Check whether a file is selected
        if (!file) {
            alert("Please select a file");
            return;
        }


        // Get JWT token from localStorage
        const token = localStorage.getItem("token");


        // Create FormData for file upload
        const formData = new FormData();


        // "marksheet" must match backend upload field name
        formData.append("marksheet", file);


        // Send attachment to backend
        const response = await axios.post(
            `http://localhost:5200/api/tickets/${id}/attachment`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        // Check upload response in console
        console.log(
            "Upload Response : ",
            response.data
        );
    }


    // =============================
    // HANDLE REOPEN
    // =============================

    const handleReopenTicket = async () => {

    const reopenRemark = prompt(
        "Why do you want to reopen this ticket?"
    );


    if (!reopenRemark || !reopenRemark.trim()) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await axios.post(
                `http://localhost:5200/api/tickets/${id}/reopen`,
        {
                remark: reopenRemark.trim()
        },

            {
                headers: {
                    Authorization: `Bearer ${token}`
        }
    }
);

        alert("Ticket reopened successfully");

        window.location.reload();

    } catch (error) {

        console.error("Reopen ticket error:", error);

        alert(
            error.response?.data?.message ||
            "Failed to reopen ticket"
        );
    }
};

    // =============================
    // HANDLE STATUS UPDATE
    // ============================
    async function handleStatusUpdate() {

        // Clear previous messages
        setSuccessMessage("");
        setErrorMessage("");


        // -----------------------------
        // Validation
        // -----------------------------

        // Status is required
        if (!newStatus) {
            setErrorMessage("Please select status");
            return;
        }

        // Remark is required when correction is requested
        if (
            newStatus === "CORRECTION_REQUIRED" &&
            !remark.trim()
        ) {
            setErrorMessage("Please enter remark");
            return;
        }


        // Start loading state
        setUpdatingStatus(true);

        try {
            // Get JWT token
            const token = localStorage.getItem("token");


            // -----------------------------
            // Update Status API
            // -----------------------------

            await axios.patch(
                `http://localhost:5200/api/tickets/${id}/status`,
                {
                    status: newStatus,
                    remark: remark
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // -----------------------------
            // Show Success Message
            // -----------------------------

            setSuccessMessage(
                "Ticket status updated successfully"
            );


            // Wait for 1 second
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            //Redirect to Tickets page
            navigate("/tickets");

        } catch (error) {

            // Log API error
            console.log(
                "Status Update Error:",
                error
            );

            // Show backend error message
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to update ticket status"
            );


            // Stop loading state
            setUpdatingStatus(false);
        }
    }


    // =============================
    // FETCH TICKET DATA
    // =============================

    useEffect(() => {

        // Get JWT token
        const token = localStorage.getItem("token");

        // Get logged-in user information
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        // Store user's role
        setUserRole(user.role);
        

        // =============================
        // TICKET DETAIL API
        // =============================


        axios.get(
            `http://localhost:5200/api/tickets/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {
                console.log(
                    "Ticket Response : ",
                    response.data
                );


                // Store ticket details
                setTicket(response.data);
            });


        // =============================
        // TICKET HISTORY API
        // ============================

        axios.get(
            `http://localhost:5200/api/tickets/${id}/history`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {

                console.log(
                    "History Response : ",
                    response.data
                );



                // Store ticket history

                setHistory(response.data.history);

            });





        // =============================

        // ATTACHMENT API

        // =============================



        axios.get(

            `http://localhost:5200/api/tickets/${id}/attachment`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        )

            .then((response) => {



                console.log(

                    "Attachment : ",

                    response.data

                );



                // Store attachment information

                setAttachment(response.data);

            });

    }, [id]);


    // =============================
    // LOADING STATE
    // =============================

    if (!ticket) {
    return (
        <div className="ticket-loading-page">
            <div className="ticket-loading-box">

                <div className="ticket-spinner"></div>

                <h2>Loading Ticket</h2>

                <p>
                    Please wait while we fetch the ticket details...
                </p>

            </div>
        </div>
    );
}


    // Find the latest reopen history entry
    const reopenHistory = [...history]
        .reverse()
        .find(
            (item) =>
                item.old_status === "COMPLETED" &&
                item.new_status === "REOPENED"
        );


    // Check ticket ID in console

    console.log("Ticket ID : ", id);


    // =============================
    // JSX
    // =============================



    return (



        <div className="ticket-details-page">





            {/* =================================

                HEADER

            ================================= */}



            <div className="ticket-details-header">



                <div className="ticket-header-left">



                    {/* Back Button */}

                    <button

                        className="back-button"

                        onClick={() => window.history.back()}

                    >

                        ← Back

                    </button>

                    <button

                        className="back-button"

                        onClick={(() => navigate("/dashboard"))}

                    >

                        Dashboard

                    </button>





                    {/* Page Title */}

                    <div>



                        <h1>

                            Ticket Details

                        </h1>



                        <p>

                            Ticket #{ticket.ticket_number}

                        </p>



                    </div>



                </div>





                {/* Current Ticket Status */}

                <div

                    className={`status-badge ${ticket.status.toLowerCase()}`}

                >

                    {ticket.status}



                </div>



                {userRole === "UNIVERSITY" &&

                    ticket.status === "COMPLETED" && (

                        <button 

                        className="reopen-ticket-button"

                        onClick={handleReopenTicket}

                        >

                            Reopen Ticket

                        </button>

                )}



            </div>





            {/* =================================

                MAIN CONTAINER

            ================================= */}



            <div className="ticket-details-container">





                {/* =================================

                    TICKET INFORMATION

                ================================= */}



                <div className="ticket-section">



                    <h2>

                        Ticket Information

                    </h2>





                    <div className="ticket-info-grid">





                        {/* Ticket ID */}

                        <div className="info-item">



                            <span>

                                Ticket ID

                            </span>



                            <strong>

                                {ticket.id}

                            </strong>



                        </div>





                        {/* Ticket Number */}

                        <div className="info-item">



                            <span>

                                Ticket Number

                            </span>



                            <strong>

                                {ticket.ticket_number}

                            </strong>



                        </div>





                        {/* Form Number */}

                        <div className="info-item">



                            <span>

                                Form Number

                            </span>



                            <strong>

                                {ticket.form_number}

                            </strong>



                        </div>





                        {/* Document Type */}

                        <div className="info-item">



                            <span>

                                Document Type

                            </span>



                            <strong>

                                {ticket.document_type}

                            </strong>



                        </div>





                        {/* Created Date */}

                        <div className="info-item">



                            <span>Created At</span>

                                <strong>{formatDateTime(ticket.created_at)}</strong>

                        </div>





                        {/* Last Updated Date */}

                        <div className="info-item">

    <span>Last Updated</span>

    <strong>{formatDateTime(ticket.updated_at)}</strong>

</div>



                    </div>



                </div>





                {/* =================================

                    REOPEN REASON

                ================================= */}



                {reopenHistory && (

                    <div className="ticket-section reopen-reason-section">

                        <h2>

                            Reopen Reason

                        </h2>

                        <div className="reopen-reason-box">

                            <strong>Reason:</strong>

                            <p>

                                {reopenHistory.remark}

                            </p>

                            <small>

                                Reopened on:{" "}
                                {formatDateTime(reopenHistory.created_at)}

                            </small>

                        </div>

                    </div>
                )}



                {/* =================================

                    STATUS UPDATE

                    Only visible to OPERATOR

                ================================= */}



                {userRole === "OPERATOR" && (



                    <div className="ticket-section">



                        <h2>

                            Update Ticket Status

                        </h2>





                        {/* Success Message */}

                        {successMessage && (



                            <div className="success-message">



                                ✓ {successMessage}



                            </div>



                        )}





                        {/* Error Message */}

                        {errorMessage && (



                            <div className="error-message">



                                ⚠ {errorMessage}



                            </div>



                        )}





                        <div className="status-update-form">





                            {/* Status Dropdown */}

                            <div className="form-group">



                                <label>

                                    Status

                                </label>





                                <select

                                    value={newStatus}

                                    onChange={(e) =>

                                        setNewStatus(

                                            e.target.value

                                        )

                                    }

                                >



                                    <option value="">

                                        Select Status

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



                            </div>





                            {/* Correction Remark */}

                            {newStatus === "CORRECTION_REQUIRED" && (



                                <div className="form-group">



                                    <label>

                                        Remark

                                    </label>





                                    <textarea

                                        value={remark}

                                        onChange={(e) =>

                                            setRemark(

                                                e.target.value

                                            )

                                        }

                                        placeholder="Enter correction remark"

                                    />



                                </div>



                            )}





                            {/* Update Status Button */}

                            <button

                                className="update-status-button"

                                onClick={handleStatusUpdate}

                                disabled={updatingStatus}

                            >



                                {updatingStatus

                                    ? "Updating..."

                                    : "Update Status"

                                }



                            </button>



                        </div>



                    </div>



                )}





                {/* =================================

                    CORRECTIONS

                ================================= */}



                <div className="ticket-section">



                    <h2>

                        Corrections

                    </h2>





                    {ticket.corrections &&

                    ticket.corrections.length > 0 ? (



                        <div className="corrections-list">



                            {ticket.corrections.map(

                                (correction, index) => (



                                    <div

                                        className="detail-correction-card"

                                        key={correction.id}

                                    >





                                        {/* Correction Number */}

                                        <div className="correction-number">



                                            {index + 1}



                                        </div>





                                        {/* Correction Details */}

                                        <div className="correction-content">



                                            <h3>

                                                {correction.correction_type}

                                            </h3>



                                            <p>

                                                {correction.correction_details}

                                            </p>



                                        </div>



                                    </div>



                                )

                            )}



                        </div>



                    ) : (



                        <p className="empty-message">

                            No corrections found.

                        </p>



                    )}



                </div>





                {/* =================================

                    MARKSHEET / ATTACHMENT

                ================================= */}



                <div className="ticket-section">



                    <h2>

                        Marksheet

                    </h2>





                    {/* 

                        Only OPERATOR can upload.

                        UNIVERSITY can only view the attachment.

                    */}



                    {userRole === "OPERATOR" && (



                        <div className="attachment-upload">



                            {/* File Selection */}

                            <input

                                type="file"

                                accept="image/png, image/jpeg"

                                onChange={(e) =>

                                    setFile(

                                        e.target.files[0]

                                    )

                                }

                            />





                            {/* Upload Button */}

                            <button

                                className="upload-button"

                                onClick={handleUpload}

                            >

                                Upload

                            </button>



                        </div>



                    )}





                    {/* Display Uploaded Marksheet */}

                    {attachment ? (



                        <div className="attachment-preview">



                            <p>



                                <strong>

                                    File:

                                </strong>{" "}



                                {attachment.file_name}



                            </p>





                            <img

                                src={`http://localhost:5200/${attachment.file_path}`}

                                alt="Uploaded marksheet"

                            />



                        </div>



                    ) : (



                        <p className="empty-message">

                            No marksheet uploaded.

                        </p>



                    )}



                </div>





                {/* =================================

                    TICKET HISTORY

                ================================= */}



                <div className="ticket-section">

                    <h2>
                        Ticket History
                    </h2>


                    {history.length > 0 ? (

                        <div className="timeline">

                            {history.map((item) => (



                                <div

                                    className="timeline-item"

                                    key={item.id}
                                >


                                    {/* Timeline Dot */}
                                    <div className="timeline-dot"></div>
                                    

                                    {/* Timeline Content */}
                                    <div className="timeline-content">





                                        {/* Status Change */}

                                        <div className="timeline-status">



                                            {item.old_status}



                                            {" → "}



                                            {item.new_status}



                                        </div>





                                        {/* Action */}

                                        <p>



                                            <strong>

                                                Action:

                                            </strong>{" "}



                                            {item.action}



                                        </p>





                                        {/* Changed By */}

                                        <p>



                                            <strong>

                                                Changed By:

                                            </strong>{" "}



                                            {item.changed_by}



                                        </p>





                                        {/* Date */}

                                        <p>



                                            <strong>
                                                Date: 
                                            </strong>

                                            <strong> {formatDateTime(ticket.created_at)}</strong>



                                        </p>





                                        {/* Remark */}

                                        {item.remark && (



                                            <p>



                                                <strong>

                                                    Remark:

                                                </strong>{" "}



                                                {item.remark}



                                            </p>



                                        )}



                                    </div>



                                </div>



                            ))}



                        </div>



                    ) : (



                        <p className="empty-message">

                            No history available.

                        </p>



                    )}



                </div>



            </div>



        </div>

    );

}





// =============================

// EXPORT COMPONENT

// =============================



export default TicketDetails;