import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CompletedTicket() {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [ticketNumber, setTicketNumber] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [searchTrigger, setSearchTrigger] = useState(0);

    useEffect(() =>  {

        const token = localStorage.getItem("token");

        axios.get(
            `http://localhost:5200/api/tickets`,
            {
                params : {
                    status : "COMPLETED",
                    ticket_number : ticketNumber,
                    document_type : documentType,
                    page : page,
                    limit : limit
                },
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
        )
        .then((Response) => {
            console.log("Completed Ticket : ", Response.data);
            setTickets(Response.data.tickets);
            setTotalPages(Response.data.pagination.totalPages);
        });
    }, [page,searchTrigger]);


    function handleSearch() {
         setPage(1);
         setSearchTrigger(searchTrigger + 1);
    }

    return (
        <div>

        <input
            type="text"
            placeholder="Ticket Number"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
        />

        <input
            type="text"
            placeholder="Document Type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
        />

        <button onClick={handleSearch}>
            Search
        </button>
            <h1>Completed ticket</h1>

            {tickets.map((ticket) => (
                <div key={ticket.id}>
                        <p>Ticket Number: {ticket.ticket_number}</p>
                        <p>Document Type: {ticket.document_type}</p>
                        <p>Status: {ticket.status}</p>

                        <button onClick={() => navigate(`/tickets/${ticket.id}`)}>
                             View
                        </button>
                </div>
            ))}

            <button onClick={() => navigate("/tickets")}>
                Active Tickets
            </button>

            <div>
                <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                >
                    Previous
                </button>

                <span>
                     page {page} of {totalPages}
                </span>

                <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CompletedTicket;