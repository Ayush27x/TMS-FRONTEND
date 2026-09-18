import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Tickets() {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        axios.get(
            "http://localhost:5200/api/tickets",
            {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            }
        )
        .then((Response) => {

            console.log("Tickets : ", Response.data);

            setTickets(Response.data.tickets);
        });
    },
     []);

    return(

        <div>
            <h1>Tickets</h1>

            <table border = "1">

                <thead>
                    <tr>
                        <th>Ticket Number</th>
                        <th>Form Number</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td> {ticket.ticket_number} </td>
                            <td> {ticket.form_number} </td>
                            <td> {ticket.student_name} </td>
                            <td> {ticket.roll_number} </td>
                            <td> {ticket.status} </td>

                            <td>
                                <button onClick={() => navigate(`/tickets/${ticket.id}`) }>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default Tickets;