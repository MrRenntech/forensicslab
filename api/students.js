export default function handler(req, res) {
    res.status(200).json([
        { name: "John Doe", id: "S101", completed: 5, score: 92, status: "Active" },
        { name: "Jane Smith", id: "S102", completed: 4, score: 88, status: "Active" },
        { name: "Michael Brown", id: "S103", completed: 2, score: 75, status: "Warning" },
        { name: "Emily Davis", id: "S104", completed: 6, score: 98, status: "Active" },
        { name: "Chris Wilson", id: "S105", completed: 0, score: 0, status: "Inactive" }
    ]);
}
