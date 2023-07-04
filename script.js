function getUserIp() {
    $.getJSON("https://api.ipify.org?format=json", function (data) {
        let ipAddress = data.ip;
        console.log(ipAddress);

        let ipcontainer = document.getElementById("ip");
        ipcontainer.innerHTML = `${ipAddress}`;
    });
}
function getuserinfo() {
    let ip = document.getElementById("ip").innerHTML;
    fetch(`https://ipinfo.io/${ip}?token=0b9a356cc5493a`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            console.log(data.asn.asn);
            let [lat, long] = data.loc.split(",");
            let timezone = data.timezone;
            let pincode = data.postal;
            showInfoAndMap(lat, long, data);
            displayTimeZoneAndpostoffice(timezone, pincode);
        })
        .catch((error) => {
            console.log("Error :", error);
        });

}

// display data and map

function showInfoAndMap(lat, long, data) {
    const btn = document.querySelector(".btn");
    btn.classList.add("removeBtn");     // remove button after getting data
    let ipDetailsContainer = document.querySelector(".ipDetails-container");
    
    let infodiv = document.createElement("div");
    infodiv.classList.add("infodiv");
    infodiv.innerHTML = `
    <ul>
    <li>Lat: ${lat}</li>
    <li>Long: ${long}</li>
    </ul>
    <ul>
    <li>City: ${data.city}</li>
    <li>Region: ${data.region}</li>
    </ul>
    <ul >
    <li>Organisation: ${data.asn.asn}</li>
    <li>Hostname: ${data.hostname}</li>
    </ul >`;

    let mapcontainer = document.querySelector(".map-container");
    let mapdiv = document.createElement("div");
    mapdiv.classList.add("map");
    mapdiv.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" width="100%" height="100%"></iframe>`
    
    ipDetailsContainer.append(infodiv);       // appending data
    mapcontainer.append(mapdiv);          // appending map
}


function displayTimeZoneAndpostoffice(timezone, pincode) {
    var pincodeCount = 0;    // counting the no of pincode
    // API request to get postoffice
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
            const postOffices = data[0].PostOffice;
            console.log(postOffices);
            postOffices.forEach((item) => {
                pincodeCount++;
            });

            let currentTime = new Date().toLocaleString("en-US", { timeZone: timezone });

            const timezoneContainer = document.querySelector(".timezone-container");
            timezoneContainer.innerHTML += `
            <ul>
                <li>Time Zone: ${timezone}</li>
                <li>Date And Time: ${currentTime}</li>
                <li>Pincode: ${pincode}</li>
                <li>Message: Number of pincode(s) found: ${pincodeCount}</li>
            </ul>
            `;

            // search bar
            const search = document.querySelector(".search");
            search.innerHTML += `
            <input type="text" id="searchBox" placeholder="Filter" oninput="filterPostOffices()">
            `;

            let postofficecontainer = document.querySelector(".postoffice-container")
            //display post offices
            postOffices.forEach((postoffice) => {
                postofficecontainer.innerHTML += `
                <ul>
                <li>Name: ${postoffice.Name}</li>
                <li>Branch Type: ${postoffice.BranchType}</li>
                <li>Delivery Status: ${postoffice.DeliveryStatus}</li>
                <li>District: ${postoffice.District}</li>
                <li>Division: ${postoffice.Division}</li>
                </ul>
                `;
            });
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}

//filter post offices
function filterPostOffices() {
    const searchBox = document.getElementById("searchBox");
    let value = searchBox.value.toLowerCase();
    console.log(value);
    let postofficecontainer = document.querySelector(".postoffice-container");
    const listItems = postofficecontainer.getElementsByTagName("ul");

    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        const text = listItem.textContent || listItem.innerText;
        if (text.toLowerCase().indexOf(value) > -1) { 
            listItem.style.display = "";
        } else {
            listItem.style.display = "none";
        }
    }

}

getUserIp();

