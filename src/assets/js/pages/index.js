///////////////////////////////
/// CONVERT SECONDS TO TIME ///
///////////////////////////////

function convertSecondstoTime(givenSeconds) {
    let dateObj = new Date(givenSeconds * 1000);
    let hours = dateObj.getUTCHours();
    let minutes = dateObj.getUTCMinutes();
    let seconds = dateObj.getSeconds();

    let timeString = hours.toString().padStart(2, '0')
        + ':' + minutes.toString().padStart(2, '0')
        + ':' + seconds.toString().padStart(2, '0');

    return timeString;
}

///////////////////////////////
///                         ///
///////////////////////////////



/////////////////////////
/// CONVERT Wh to KWh ///
/////////////////////////

function convertEnergyPower(value) {
    if (value <= 10000) {
        var realPowerCalc = value.toFixed(1);
        var realPowerWh = `${realPowerCalc} Wh`;
    } else {
        var realPowerCalc = (value / 1000).toFixed(2);
        var realPowerWh = `${realPowerCalc} kWh`;
    }

    return realPowerWh;
}

///////////////////////////////////////
/// COLLECT CONTROLLER DATA VIA API ///
///////////////////////////////////////

// this function returns the controller_uid, device_name, firmware_version,
// hardware_version, parrent_device_uid and position

// host variable is the IP adress for the controller API
async function getControllerData(host) {
    // Get data via API call
    let controllerData = await fetchApi(`http://${host}:5555/api/v1.0/charging-controllers`);

    // Create an empty object
    let outputData = [];

    // Loop over the controller data
    for (var controller of Object.keys(controllerData)) {
        let controllerUid = controller;
        let controllerObj = controllerData[controllerUid];

        // Insert the controller data to dictionary
        outputData[controllerUid] = {
            controller_uid: controllerUid,
            device_name: controllerObj.device_name,
            firmware_version: controllerObj.firmware_version,
            hardware_version: controllerObj.hardware_version,
            parent_device_uid: controllerObj.parent_device_uid,
            position: controllerObj.position
        }

        /////////////////////////////////////////
        /// CHARGING POINTS DATA VIA API CALL ///
        /////////////////////////////////////////
        let pointData = await fetchApi(`http://${host}:5555/api/v1.0/charging-points`);

        // Loop over the data
        for (var chargingPoint of Object.keys(pointData["charging_points"])) {
            let pointObj = pointData["charging_points"][chargingPoint];

            // If the current charging point has the corresponding id
            if (pointObj["charging_controller_device_uid"] == controllerUid) {
                outputData[controllerUid]["charging_point_name"] = pointObj.charging_point_name;
            }
        }
    }

    return outputData;
}

//////////////////////////////////////
///                                ///
/////////////////////////////////////



///////////////////////////////////////////////
/// COLLECT CHARGING STATE AND DATA VIA API ///
///////////////////////////////////////////////

// this function returns the connected_state [connected or disconnected],
// connected_time, charging_time, real_power

async function getChargingData(host, controllerUid) {
    // Connected states
    const connectedStates = ["B1", "B2", "C1", "C2", "D1", "D2"];

    // Get connected state via API call
    let stateData = await fetchApi(`http://${host}:5555/api/v1.0/charging-controllers/${controllerUid}/data?param_list=iec_61851_state`)

    // Get energy data via API call
    var energyData = await fetchApi(`http://${host}:5555/api/v1.0/charging-controllers/${controllerUid}/data?param_list=energy`);
    var energyObj = energyData["energy"];

    // Create an empty object
    let outputData = [];

    // If vehicle is connected
    if (connectedStates.includes(stateData["iec_61851_state"])) {
        // Get connected time via API call
        let connectedTimeSec = await fetchApi(`http://${host}:5555/api/v1.0/charging-controllers/${controllerUid}/data?param_list=connected_time_sec`);
        let connectedTime = convertSecondstoTime(connectedTimeSec["connected_time_sec"]);

        // Get charging time via API call
        let chargingTimeSec = await fetchApi(`http://${host}:5555/api/v1.0/charging-controllers/${controllerUid}/data?param_list=charge_time_sec`);
        let chargingTime = convertSecondstoTime(chargingTimeSec["charge_time_sec"]);

        // Write the data to object
        outputData[controllerUid] = {
            connected_state: "connected",
            connected_time: connectedTime,
            charging_time: chargingTime,
            real_power: energyObj.real_power,
        }

    } else {
        // Write the data to object
        outputData[controllerUid] = {
            connected_state: "disconnected",
            connected_time: 0,
            charging_time: 0,
        }
    }

    outputData[controllerUid]["energy_real_power"] = energyObj.energy_real_power;
    outputData[controllerUid]["part_energy_real_power"] = energyObj.part_energy_real_power;

    return outputData;
}

//////////////////////////////////////////////////////////////////////
/// INITIALIZE CONTROLLER DATA AND CREATE CONTROLLER CARD ELEMENTS ///
//////////////////////////////////////////////////////////////////////

async function initControllers(host) {
    // Get controller data via API call
    let controllerData = await getControllerData(host);

    // Loop over the controller data
    for (var controller of Object.keys(controllerData)) {
        var controllerObj = controllerData[controller];

        ///////////////////////////////////////
        /// Create controller card elements ///
        ///////////////////////////////////////
        let emptyCard = document.querySelector("#empty-controller-card");
        let newCard = emptyCard.cloneNode(true);

        // Set id of the new controller card, remove the 'hidden' class and add data attribute to modal toggle
        newCard.id = `controller-card-${controllerObj.controller_uid}`;
        newCard.classList.remove("hidden");
        newCard.querySelector(".modal-toggle").dataset.controllerUid = controllerObj.controller_uid;

        // Set the controller card data
        newCard.querySelector(".controller-uid").innerHTML = controllerObj.controller_uid;
        newCard.querySelector(".device-name").innerHTML = controllerObj.device_name;
        newCard.querySelector(".position").innerHTML = controllerObj.position;
        newCard.querySelector(".charging-point-name").innerHTML = controllerObj.charging_point_name;
        


        ////////////////////////////////////////
        /// Create controller modal elements ///
        ////////////////////////////////////////
        let emptyModal = document.querySelector("#empty-controller-modal");
        let newModal = emptyModal.cloneNode(true);

        // Set id of the new controller modal  and add data attribute to modal toggle
        newModal.id = `controller-modal-${controllerObj.controller_uid}`;
        newModal.classList.add = `modal-${controllerObj.controller_uid}`;
        newModal.querySelector(".modal-toggle").dataset.controllerUid = controllerObj.controller_uid;

        // Set the controller modal data
        newModal.querySelector(".controller-uid").innerHTML = controllerObj.controller_uid;
        newModal.querySelector(".device-name").innerHTML = controllerObj.device_name;
        newModal.querySelector(".firmware-version").innerHTML = controllerObj.firmware_version;
        newModal.querySelector(".hardware-version").innerHTML = controllerObj.hardware_version;
        newModal.querySelector(".parent-device-uid").innerHTML = controllerObj.parent_device_uid;
        newModal.querySelector(".position").innerHTML = controllerObj.position;
        newModal.querySelector(".charging-point-name").innerHTML = controllerObj.charging_point_name;

        /////////////////////////////
        /// Controller card state ///
        /////////////////////////////
        let chargingData = await getChargingData(host, controllerObj.controller_uid);
        var chargingObj = chargingData[controllerObj.controller_uid];

        // Energy real power
        let energyRealPower = convertEnergyPower(chargingObj.energy_real_power.value);
        let partEnergyRealPower = convertEnergyPower(chargingObj.part_energy_real_power.value);

        newModal.querySelector(".energy-real-power").innerHTML = energyRealPower;
        newModal.querySelector(".part-energy-real-power").innerHTML = partEnergyRealPower;

        // If vehicle is connected to the charging point
        if (chargingObj.connected_state == "connected") {
            ////////////////////////////////////////
            /// Controller charging data in card ///
            ////////////////////////////////////////
            newCard.querySelector(".charging-state").innerHTML = "Nabíjí";
            newCard.querySelector(".charging-state").classList.add("bg-blue-500");
            newCard.querySelector(".charging-icon").classList.remove("hidden"); // card charging icon

            newCard.querySelector(".charging-information").classList.add("connected");

            newCard.querySelector(".charging-time").innerHTML = chargingObj.charging_time;

            /////////////////////////////////////////
            /// Controller charging data in modal ///
            /////////////////////////////////////////
            newModal.querySelector(".charging-state").innerHTML = "Nabíjí";
            newModal.querySelector(".charging-state").classList.add("bg-blue-500");
            newModal.querySelector(".charging-icon").classList.remove("hidden"); // modal charging icon

            newModal.querySelector(".charging-information").classList.add("connected");

            // Calculate power Watts
            let realPower = chargingObj.real_power.value
            
            if (realPower <= 10000) {
                var realPowerCalc = realPower.toFixed(1);
                var realPowerWatt = `${realPowerCalc} W`
            } else {
                var realPowerCalc = (realPower / 1000).toFixed(2);
                var realPowerWatt = `${realPowerCalc} kW`
            }

            newModal.querySelector(".real-power").innerHTML = realPowerWatt;
            newModal.querySelector(".connected-time").innerHTML = chargingObj.connected_time;
            newModal.querySelector(".charging-time").innerHTML = chargingObj.charging_time;

        } else {
            ////////////////////////////////////////
            /// Controller charging data in card ///
            ////////////////////////////////////////
            newCard.querySelector(".charging-state").innerHTML = "K dispozici";
            newCard.querySelector(".charging-state").classList.add("bg-green-500");

            newCard.querySelector(".charging-information").classList.add("disconnected");

            /////////////////////////////////////////
            /// Controller charging data in modal ///
            /////////////////////////////////////////
            newModal.querySelector(".charging-state").innerHTML = "K dispozici";
            newModal.querySelector(".charging-state").classList.add("bg-green-500");

            newModal.querySelector(".charging-information").classList.add("disconnected");
        }

        // Copy the created elements to screen
        let controllerCards = document.querySelector("#controller-cards");
        controllerCards.appendChild(newCard);

        let controllerModals = document.querySelector("#controller-modals");
        controllerModals.appendChild(newModal);

    };
}

//////////////////////////////////////////////////////////////////////
///                                                                ///
//////////////////////////////////////////////////////////////////////



////////////////////////////////////////////
/// REFRESH CONNECTION DATA VIA API CALL ///
////////////////////////////////////////////

async function refreshConnectionData(host) {
    // Get controller data via API call
    let controllerData = await getControllerData(host);

    // Loop over the controller data
    for (var controller of Object.keys(controllerData)) {
        var controllerObj = controllerData[controller];

        // Get controller card element
        let controllerCard = document.querySelector(`#controller-card-${controllerObj.controller_uid}`);
        let controllerModal = document.querySelector(`#controller-modal-${controllerObj.controller_uid}`);

        // Get charging data via API call
        let chargingData = await getChargingData(host, controllerObj.controller_uid);
        var chargingObj = chargingData[controllerObj.controller_uid];

        // If vehicle is connected to the charging point
        if (chargingObj.connected_state == "connected") {
            ////////////////////////////////////////
            /// Controller charging data in card ///
            ////////////////////////////////////////
            controllerCard.querySelector(".charging-state").innerHTML = "Nabíjí";
            controllerCard.querySelector(".charging-state").classList.add("bg-blue-500");

            controllerCard.querySelector(".charging-information").classList.add("connected");

            controllerCard.querySelector(".charging-time").innerHTML = chargingObj.charging_time;

            /////////////////////////////////////////
            /// Controller charging data in modal ///
            /////////////////////////////////////////
            controllerModal.querySelector(".charging-state").innerHTML = "Nabíjí";
            controllerModal.querySelector(".charging-state").classList.add("bg-blue-500");

            controllerModal.querySelector(".charging-information").classList.add("connected");

            // Calculate power Watts
            let realPower = chargingObj.real_power.value

            if (realPower <= 10000) {
                var realPowerCalc = realPower.toFixed(1);
                var realPowerWatt = `${realPowerCalc} W`
            } else {
                var realPowerCalc = (realPower / 1000).toFixed(2);
                var realPowerWatt = `${realPowerCalc} kW`
            }

            controllerModal.querySelector(".real-power").innerHTML = realPowerWatt;
            controllerModal.querySelector(".connected-time").innerHTML = chargingObj.connected_time;
            controllerModal.querySelector(".charging-time").innerHTML = chargingObj.charging_time;

        } else {
            controllerCard.querySelector(".charging-state").innerHTML = "K dispozici";
            controllerCard.querySelector(".charging-state").classList.add("bg-green-500");

            controllerCard.querySelector(".charging-information").classList.add("disconnected");
        }

        /////////////////////////////////////////
        ///                                   ///
        /////////////////////////////////////////
    };

    // Keep running this function every 5 seconds
    setTimeout(() => refreshConnectionData(host), 2500)
}

////////////////////////////////////////////
///                                      ///
////////////////////////////////////////////



// Set the host IP hostname for API calls
var currentHost = window.location.hostname

// Initialize controller data
initControllers("192.168.150.241")

// Wait 5 seconds and then run function that refreshes connection data
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(5000);
refreshConnectionData("192.168.150.241");