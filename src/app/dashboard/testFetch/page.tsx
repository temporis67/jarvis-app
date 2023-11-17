"use client";

import React, { useState, useEffect } from "react";

function Page() {
    const [dataEntries, setDataEntries] = useState([]);

    let formData = new FormData();
    formData.append("email", "test@irgendwo.de");
    const api_host = "http://127.0.0.1:5000/api";
    const api_url = api_host + "/questions";

    const fetchData = async () => {
        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataEntries(Object.values(data)); // Wandelt das Objekt in ein Array von Werten um
            console.log("Erstes Element:", data[Object.keys(data)[0]].title, data[Object.keys(data)[0]].uuid);

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Fragen:</h2>
            {dataEntries.length > 0 ? (
                dataEntries.map(entry => (
                    <div key={
                        //@ts-ignore
                        entry.uuid}>
                        <h3>Titel: {
                            //@ts-ignore
                            entry.title}</h3>
                        <p>{
                            //@ts-ignore
                            entry.content}</p>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Page;
