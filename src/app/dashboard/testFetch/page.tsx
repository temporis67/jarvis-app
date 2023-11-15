"use client";

import React, { useState, useEffect } from "react";

function Page() {
    const [my_info, setMyInfo] = useState(null);

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
            const data = await response.json();
            // setMyInfo(data.title);
            console.log("Response ready: ", data);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(" *************** Fetching from " + api_url);
    fetchData();

    return (
        <div>
            <h2>Joke of the day:</h2>
            {my_info && <p>{my_info}#</p>}
        </div>
    );
}

export default Page;
