import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function TicketDetails() {

    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [history, setHistory] = useState([]);
    const [newStatus, setNewStatus] = useState("");
    const [remark, setRemark] = useState("");   
    const [file, setFile] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const [userRole, setUserRole] = useState("");


    async function handleUpload() {

        if(!file) {
            alert("Please select a file");
            return
        }

        const token = localStorage.getItem("token");


        const formData = new FormData();

        formData.append("marksheet", file);

        const response = await axios.post(
            `http://localhost:5200/api/tickets/${id}/attachment`,
            formData,
            {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            }
        );

        console.log("Upload Response : ", response.data) 
    }


    async function handleStatusUpdate() {

        if(!newStatus) {
            alert("Please select status")
            return;
        }

        if(newStatus === "CORRECTION_REQUIRED" && !remark.trim()) {
            alert("Please enter remark")
            return;
        }

        const token = localStorage.getItem("token");


        const response = await axios.patch(
            `http://localhost:5200/api/tickets/${id}/status`,
            {
                status : newStatus,
                remark : remark
            },
            {headers : {
                Authorization : `Bearer ${token}`
            }}
        );

        console.log("Updated response : ", response.data)

        console.log("Selected status : ", newStatus);

        setTicket({
            ...ticket,
            status : newStatus
        });

        const historyResponse = await axios.get(
            `http://localhost:5200/api/tickets/${id}/history`,{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
        );

        setHistory(historyResponse.data.history);
        setNewStatus("");
        setRemark("")
    }

    useEffect(() => {

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        setUserRole(user.role);

        // Ticket Detail API
        axios.get(
            `http://localhost:5200/api/tickets/${id}`,
            {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }

        )
        .then((Response) => {
            console.log(Response.data);

            setTicket(Response.data);

        })

        // History API
        axios.get(
            `http://localhost:5200/api/tickets/${id}/history`,
            {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
        )
        .then((Response) => {
            console.log("History response : ",Response.data);

            setHistory(Response.data.history)
        })


        //Attachment
        axios.get(
            `http://localhost:5200/api/tickets/${id}/attachment`,
            {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
        ).then((response) => {
            console.log("Attachment : ", response.data);
            setAttachment(response.data);
        });
    }, [id])

    


        if(!ticket) {
            return <p>Loading...</p>
        }
            console.log("Ticket ID : ", id);
        return (

        <div>


            {/* Ticket details box =======================*/}
            <h1>Ticket details</h1>

            <p>Ticket ID : {id} </p>
            <p>Ticket Number : {ticket.ticket_number} </p>
            <p>Form Number : {ticket.form_number} </p>
            <p>Document Type : {ticket.document_type}</p>

            {/* Status========================= */}

            {userRole === "OPERATOR" && (
            
            <div>
                <label>Update Status : </label>

                    <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    >
                    <option></option>
                    <option>NEW</option>
                    <option>IN_PROGRESS</option>
                    <option>COMPLETED</option>
                    <option>CORRECTION_REQUIRED</option>
                </select>

                <button onClick={handleStatusUpdate}>
                    Update status
                </button>
            </div>
            )}

            {newStatus === "CORRECTION_REQUIRED" && (
                <div>
                    <label >Remark</label>

                    <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter correction required"
                    required
                    ></textarea>

                </div>
            )}
            <div>
                        <h2>Corrections</h2>

                        {ticket.corrections &&
                            ticket.corrections.map((correction, index) => (

                                <div key={correction.id}> 

                                    <h3>
                                        {index + 1}. {correction.correction_type}
                                    </h3>
                                    <p>
                                        Details : {correction.correction_details}
                                    </p>

                                </div>
                            ))
                            }
                                <p>Status : {ticket.status} </p>
                            </div>


            {/* Attachment */}
            <h2>Attachment</h2>
            <input 
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>
                Upload
            </button>

            {attachment && (
                <div>
                    <p>File Name : {attachment.file_name} </p>

                    <img
                        src={`http://localhost:5200/${attachment.file_path}`}
                        alt = "Uploaded marksheet"
                        rel="noreferrer"
                        width= "400"
                    />
                </div>
            )}


            {/* History box ==============================*/}
            <h2>Ticket History</h2> 
            {/*  owl timeline */}
            <div className = "timeline">

            {history.map((item) => (

                // a history recode (timeline-item)
                <div className = "timeline-item" key={item.id}>

                    {/* dot and | before :: */}
                    <div className="timeline-dot"></div>

                    {/* History box */}
                    <div className="timeline-content">

                    <p> {item.old_status} → {item.new_status}  </p>
                    <p>Action : {item.action} </p>
                    <p>Changed By : {item.changed_by}</p>
                    <p>Date : {item.created_at} </p>

                        {item.remark && (

                            <p>Remark : {item.remark} </p>
                    )}

                        </div>                
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TicketDetails;