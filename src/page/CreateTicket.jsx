import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";

function CreateTicket() {

    const navigate = useNavigate();

    const [formNumber, setFormNumber] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [correctionType, setCorrectionType] = useState("");
    const [corrections, setCorrection] = useState([]);
    const [correctionDetails, setCorrectionDetails] = useState("");
    const [file, setFile] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    async function handleCreateTicket() {

        //Clear Previous Message
        setSuccessMessage("");
        setErrorMessage("");


    if (!formNumber) {
        alert("Please Enter Form Number");
        return;
    }

    if (!documentType) {
        alert("Please select document type");
        return;
    }

    if (corrections.length === 0) {
        alert("Please add at least one correction");
        return;
    }

    if (!file) {
        alert("Please Upload Marksheet");
        return;
    }

    // Start Loading
    setCreatingTicket(true);

    try {

        const token = localStorage.getItem("token");


        // Create Ticket

        const response = await axios.post(
            "http://localhost:5200/api/tickets",
            {
                form_number: formNumber,
                document_type: documentType,
                corrections: corrections
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const ticketId = response.data.ticketId;


        // Upload Marksheet

        const formData = new FormData();

        formData.append("marksheet", file);

        await axios.post(
            `http://localhost:5200/api/tickets/${ticketId}/attachment`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        console.log(
            "Create ticket response : ",
            response.data
        );


        //Success Message
        setSuccessMessage("Ticket Created Successfully");


        // Keep animation visible
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });


        navigate(`/tickets/${ticketId}`);

    } catch (error) {

        console.log(
            "Create Ticket Error : ",
            error
        );

        setErrorMessage(
            error.response?.data?.message ||
            "Failed to create ticket"
        );

        setCreatingTicket(false);
    }
}


function handleAddCorrection() {

    if (!correctionType) {
        alert("Please select correction type");
        return;
    }

    if (!correctionDetails.trim()) {
        alert("Please enter correction details");
        return;
    }

    // EDIT MODE
    if (editingIndex !== null) {
        const updatedCorrections = [...corrections];

        updatedCorrections[editingIndex] = {
            type: correctionType,
            details: correctionDetails
        };

        setCorrection(updatedCorrections);
        setEditingIndex(null);
        setCorrectionType("");
        setCorrectionDetails("");

        return;
    }

    // NEW CORRECTION MODE
    const alreadyExists = corrections.some(
        (correction) => correction.type === correctionType
    );

    if (alreadyExists) {
        alert("This correction has already been added");
        return;
    }

    setCorrection([
        ...corrections,
        {
            type: correctionType,
            details: correctionDetails
        }
    ]);

    setCorrectionType("");
    setCorrectionDetails("");
}

    function handleRemoveCorrection(index) {

        const updateCorrections = corrections.filter(
            (correction, i) => i !== index
        );

        setCorrection(updateCorrections);
    }

    return (
    <div className="create-ticket-page">

        <div className="create-ticket-header">
            <div>
                <h1>Create Ticket</h1>
                <p>Create a new ticket for university correction</p>
            </div>

            <button
                className="back-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Dashboard
            </button>
        </div>


        <div className="create-ticket-container">

            {/* BASIC INFORMATION */}

            <div className="ticket-section">

                <h2>Ticket Information</h2>

                <div className="form-group">

                    <label>Form Number</label>

                    <input
                        type="text"
                        placeholder="Enter Form Number"
                        value={formNumber}
                        onChange={(e) => setFormNumber(e.target.value)}
                    />

                </div>


                <div className="form-group">

                    <label>Document Type</label>

                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                    >
                        <option value="">
                            Select Document Type
                        </option>

                        <option value="MARKSHEET">
                            Marksheet
                        </option>

                        <option value="PROVISIONAL">
                            Provisional
                        </option>

                        <option value="MIGRATION">
                            Migration
                        </option>

                        <option value="OTHER">
                            Other
                        </option>

                    </select>

                </div>

            </div>


            {/* CORRECTION SECTION */}

            <div className="ticket-section">

                <h2>Add Correction</h2>

                <div className="form-group">

                    <label>Correction Type</label>

                    <select
                        value={correctionType}
                        onChange={(e) =>
                            setCorrectionType(e.target.value)
                        }
                    >

                        <option value="">
                            Select Correction Type
                        </option>

                        <option value="NAME">
                            Name
                        </option>

                        <option value="FNAME">
                            Father Name
                        </option>

                        <option value="MNAME">
                            Mother Name
                        </option>

                        <option value="ENR">
                            Enrollment Number
                        </option>

                        <option value="MARKS">
                            Marks
                        </option>

                        <option value="CENTER">
                            Center Name
                        </option>

                        <option value="OTHER">
                            Other
                        </option>

                    </select>

                </div>


                {correctionType && (

                    <div className="form-group">

                        <label>
                            Correction Details
                        </label>

                        <textarea
                            placeholder="Enter correction details"
                            value={correctionDetails}
                            onChange={(e) =>
                                setCorrectionDetails(e.target.value)
                            }
                        />

                    </div>

                )}


                <button
                    className="add-correction-button"
                    onClick={handleAddCorrection}
                >
                    {editingIndex !== null
                        ? "Update Correction"
                        : "+ Add Correction"
                    }
                </button>

            </div>


            {/* SELECTED CORRECTIONS */}

            {corrections.length > 0 && (

                <div className="ticket-section">

                    <h2>Selected Corrections</h2>

                    <div className="corrections-list">

                        {corrections.map((correction, index) => (

                            <div
                                className="correction-card"
                                key={index}
                            >

                                <div className="correction-content">

                                    <h3>
                                        {index + 1}. {correction.type}
                                    </h3>

                                    <p>
                                        {correction.details}
                                    </p>

                                </div>


                                <div className="correction-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setCorrectionType(
                                                correction.type
                                            );
                                            setCorrectionDetails(
                                                correction.details
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="remove-button"
                                        onClick={() =>
                                            handleRemoveCorrection(index)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}


            {/* MARKSHEET UPLOAD */}

            <div className="ticket-section">

                <h2>Marksheet</h2>

               <div className="file-upload">

    <label className="file-upload-label">
        Upload Marksheet
    </label>

    <label className="file-drop-area">

        <span className="upload-icon">
            📄
        </span>

        <span className="upload-text">
            {file
                ? file.name
                : "Choose Marksheet Image"
            }
        </span>

        <span className="upload-hint">
            JPG or PNG
        </span>

        <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) =>
                setFile(e.target.files[0])
            }
        />

    </label>

</div>

            </div>

            {/*  Message */}
            {successMessage && (
                <div
                className="success-message"
                >
                    ✓ {successMessage}
                </div>
            )}

            {errMessage && (
                <div className="error-message">
                    ⚠ {errorMessage}
                </div>
            )}


            {/* CREATE BUTTON */}

            <button
                className={`create-ticket-submit ${
                creatingTicket ? "creating-ticket" : ""
            }`}
                onClick={handleCreateTicket}
                disabled={creatingTicket}
            >

                {creatingTicket && (
                    <span className="flying-ticket">
                        <span className="ticket-text">
                            TICKET
                        </span>
                    </span>
                )}

                    <span>
                        {creatingTicket
                        ? "Creating Ticket..."
                        : "Create Ticket"
                        }
                    </span>

            </button>

        </div>

    </div>
);
}
export default CreateTicket;