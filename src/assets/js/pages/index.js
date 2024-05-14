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
    if (value <= 1000) {
        var realPowerCalc = value.toFixed(1);
        var realPowerWh = `${realPowerCalc} Wh`;
    } else {
        var realPowerCalc = (value / 1000).toFixed(2);
        var realPowerWh = `${realPowerCalc} kWh`;
    }

    return realPowerWh;
}

/////////////////////////
///                   ///
/////////////////////////



//////////////////////////////////////////////////////////////////////
/// INITIALIZE CONTROLLER DATA AND CREATE CONTROLLER CARD ELEMENTS ///
//////////////////////////////////////////////////////////////////////

async function initControllers() {
    // Get controller data via API call
    let controllerData = await fetchApi("/data/controller_data.json");

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

        // Part energy real power
        let energyRealPower = convertEnergyPower(controllerObj.charging_data.energy_real_power.value);
        let partEnergyRealPower = convertEnergyPower(controllerObj.charging_data.part_energy_real_power.value);

        newModal.querySelector(".energy-real-power").innerHTML = energyRealPower;
        newModal.querySelector(".part-energy-real-power").innerHTML = partEnergyRealPower;


        
        // If vehicle is connected to the charging point
        if (controllerObj.charging_data.connected_state == "connected") {
            ////////////////////////////////////////
            /// Controller charging data in card ///
            ////////////////////////////////////////
            newCard.querySelector(".charging-state").innerHTML = "Nabíjí";
            newCard.querySelector(".charging-state").classList.add("bg-blue-500");
            newCard.querySelector(".charging-icon").classList.remove("hidden"); // card charging icon

            newCard.querySelector(".charging-information").classList.add("connected");

            newCard.querySelector(".charging-time").innerHTML = convertSecondstoTime(controllerObj.charging_data.charge_time_sec);

            // Calculate power Watts
            let realPower = controllerObj.charging_data.real_power.value
            
            if (realPower <= 10000) {
                var realPowerCalc = realPower.toFixed(1);
                var realPowerWatt = `${realPowerCalc} W`
            } else {
                var realPowerCalc = (realPower / 1000).toFixed(2);
                var realPowerWatt = `${realPowerCalc} kW`
            }

            newCard.querySelector(".real-power").innerHTML = realPowerWatt;
            newCard.querySelector(".part-energy-real-power").innerHTML = partEnergyRealPower;

            /////////////////////////////////////////
            /// Controller charging data in modal ///
            /////////////////////////////////////////
            newModal.querySelector(".charging-state").innerHTML = "Nabíjí";
            newModal.querySelector(".charging-state").classList.add("bg-blue-500");
            newModal.querySelector(".charging-icon").classList.remove("hidden"); // modal charging icon

            newModal.querySelector(".charging-information").classList.add("connected");

            newModal.querySelector(".real-power").innerHTML = realPowerWatt;
            newModal.querySelector(".connected-time").innerHTML = convertSecondstoTime(controllerObj.charging_data.connected_time_sec);
            newModal.querySelector(".charging-time").innerHTML = convertSecondstoTime(controllerObj.charging_data.charge_time_sec);

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

async function refreshConnectionData() {
    // Get controller data via API call
    let controllerData = await fetchApi("/data/controller_data.json");

    // Loop over the controller data
    for (var controller of Object.keys(controllerData)) {
        var controllerObj = controllerData[controller];

        // Get controller card element
        let controllerCard = document.querySelector(`#controller-card-${controllerObj.controller_uid}`);
        let controllerModal = document.querySelector(`#controller-modal-${controllerObj.controller_uid}`);

        // If vehicle is connected to the charging point
        if (controllerObj.charging_data.connected_state == "connected") {
            ////////////////////////////////////////
            /// Controller charging data in card ///
            ////////////////////////////////////////
            controllerCard.querySelector(".charging-state").innerHTML = "Nabíjí";
            controllerCard.querySelector(".charging-state").classList.add("bg-blue-500");

            controllerCard.querySelector(".charging-information").classList.add("connected");

            // Check if controller card element '.charging-information' has 'disconnected' class and remove it if it does
            if (controllerCard.querySelector(".charging-information").classList.contains("disconnected")) {
                controllerCard.querySelector(".charging-information").classList.remove("disconnected");
            }

            if (controllerCard.querySelector(".charging-state").classList.contains("bg-green-500")) {
                controllerCard.querySelector(".charging-state").classList.remove("bg-green-500");
            }

            controllerCard.querySelector(".charging-icon").classList.remove("hidden"); // show card charging icon

            controllerCard.querySelector(".charging-time").innerHTML = convertSecondstoTime(controllerObj.charging_data.charge_time_sec);

            /////////////////////////////////////////
            /// Controller charging data in modal ///
            /////////////////////////////////////////
            controllerModal.querySelector(".charging-state").innerHTML = "Nabíjí";
            controllerModal.querySelector(".charging-state").classList.add("bg-blue-500");

            controllerModal.querySelector(".charging-information").classList.add("connected");

            // Check if controller card element '.charging-information' has 'disconnected' class and remove it if it does
            if (controllerModal.querySelector(".charging-information").classList.contains("disconnected")) {
                controllerModal.querySelector(".charging-information").classList.remove("disconnected");
            }

            if (controllerModal.querySelector(".charging-state").classList.contains("bg-green-500")) {
                controllerModal.querySelector(".charging-state").classList.remove("bg-green-500");
            }

            controllerModal.querySelector(".charging-icon").classList.remove("hidden"); // show modal charging icon

            // Calculate power Watts
            let realPower = controllerObj.charging_data.real_power.value

            if (realPower <= 10000) {
                var realPowerCalc = realPower.toFixed(1);
                var realPowerWatt = `${realPowerCalc} W`
            } else {
                var realPowerCalc = (realPower / 1000).toFixed(2);
                var realPowerWatt = `${realPowerCalc} kW`
            }

            controllerModal.querySelector(".real-power").innerHTML = realPowerWatt;
            controllerModal.querySelector(".connected-time").innerHTML = convertSecondstoTime(controllerObj.charging_data.connected_time_sec);
            controllerModal.querySelector(".charging-time").innerHTML = convertSecondstoTime(controllerObj.charging_data.charge_time_sec);

        } else {
            controllerCard.querySelector(".charging-state").innerHTML = "K dispozici";
            controllerCard.querySelector(".charging-state").classList.add("bg-green-500");

            controllerCard.querySelector(".charging-information").classList.add("disconnected");

            controllerCard.querySelector(".charging-icon").classList.add("hidden"); // hide card charging icon
            controllerModal.querySelector(".charging-icon").classList.add("hidden"); // hide modal charging icon
        }

        /////////////////////////////////////////
        ///                                   ///
        /////////////////////////////////////////
    };

    // Keep running this function every 5 seconds
    setTimeout(() => refreshConnectionData(), 5000)
}

////////////////////////////////////////////
///                                      ///
////////////////////////////////////////////



// Initialize controller data
initControllers();

// Wait 5 seconds and then run function that refreshes connection data
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(5000);
refreshConnectionData();