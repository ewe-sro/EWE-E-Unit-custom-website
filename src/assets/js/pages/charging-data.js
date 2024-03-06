// Get CSV data
let csvData = await fetchCsv("/data/charging_data.csv");

// Parse the CSV data to JSON
let chargingData = Papa.parse(csvData, {header: true,});

// Loop over the header data
let tableHead = chargingData.data[0];

// Loop over the charging data
for (let row in chargingData.data) {
  var chargingObj = chargingData.data[row];

  // Check if record row has data
  if (chargingObj.deviceUid != null) {
    /////////////////////////
    /// Create table rows ///
    /////////////////////////
    let emptyRow = document.querySelector("#empty-charging-row");
    let newRow = emptyRow.cloneNode(true);

    // Set id of the new table row, remove the 'hidden' class
    newRow.id = `charging-row-${chargingObj.id}`;
    newRow.classList.remove("hidden");

    // Set the row charging data data
    newRow.querySelector(".record-id").innerHTML = chargingObj.id;
    newRow.querySelector(".device-uid").innerHTML = chargingObj.deviceUid;
    newRow.querySelector(".charging-point-name").innerHTML = chargingObj.chargingPointName;
    newRow.querySelector(".start-timestamp").innerHTML = chargingObj.startTimestamp;
    newRow.querySelector(".end-timestamp").innerHTML = chargingObj.endTimestamp;
    newRow.querySelector(".duration").innerHTML = chargingObj.duration;
    newRow.querySelector(".rfid-tag").innerHTML = chargingObj.rfidTag;
    newRow.querySelector(".consumption").innerHTML = chargingObj.consumptionWh;

    // Show the charging icon if row doens't have endTimestamp
    if (chargingObj.endTimestamp == "") {
      newRow.querySelector(".charging-icon").classList.remove("hidden");
    }

    // Copy the created rows to table
    let chargingTable = document.querySelector("#charging-data #charging-data-body");
    chargingTable.appendChild(newRow);
  }
}