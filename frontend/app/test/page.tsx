"use client";
import React, { useState } from "react";

const Test = () => {
    const [type, setType] = useState("AMC");
    const [scheduledDate, setScheduledDate] = useState<string>("");
    const [beforeImage, setBeforeImage] = useState<File | null>(null);
    const [afterImage, setAfterImage] = useState<File | null>(null);
    const [serverResponse, setServerResponse] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setServerResponse("");

        const formData = new FormData();
        formData.append("type", type);
        formData.append("scheduledDate", scheduledDate);
        if (beforeImage) formData.append("beforeImage", beforeImage);
        if (afterImage) formData.append("afterImage", afterImage);

        try {
            const res = await fetch("http://localhost:3001/api/services/book", {
                method: "POST",
                body: formData,
                credentials: "include", // Include cookies for authentication
            });

            const data = await res.json();
            setServerResponse(data);
            console.log("Response:", data);
        } catch (error) {
            console.error("Error:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Book a Service</h1>
            <span>
                {JSON.stringify(serverResponse)}
            </span>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Service Type:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2"
                    >
                        <option value="AMC">AMC</option>
                        <option value="URGENT">URGENT</option>
                    </select>
                </div>

                <div>
                    <label>Scheduled Date:</label>
                    <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="border p-2"
                    />
                </div>

                <div>
                    <label>Before Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                    />
                </div>

                <div>
                    <label>After Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Test;
