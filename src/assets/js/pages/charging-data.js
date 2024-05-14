////////////////////////////////
/// INITIALIZE CHARGING DATA ///
////////////////////////////////

async function initChargingData() {
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
        newRow.querySelector(".charging-icon").classList.remove("opacity-0");
      }

      // Copy the created rows to table
      let chargingTable = document.querySelector("#charging-data #charging-data-body");
      chargingTable.appendChild(newRow);
    }
  }
}

////////////////////////////////
///                          ///
////////////////////////////////



/////////////////////////
/// SEARCH TABLE DATA ///
/////////////////////////

function searchData() {
  // Declare variables
  var input, filter, table, tr, td, txtValue;
  input = document.querySelector("#table-search");
  filter = input.value.toUpperCase();
  table = document.querySelector("#charging-data tbody");
  tr = table.querySelectorAll("tr");

  // Loop through all table rows
  for (var row of tr) {
    // Hide the row initially.
    row.style.display = "none";

    // Get all cells in table row
    td = row.querySelectorAll("td");

    if (td) {
      // Loop trough all cells in row
      for (let cell of td) {
        txtValue = cell.textContent || cell.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          row.style.display = "";
          break;
        }
      }
    }
  }
}

/////////////////////////
///                   ///
/////////////////////////



// Initialize charging data
initChargingData();

// Add eventListener to search input
let searchInput = document.querySelector("#table-search");
searchInput.addEventListener("input", searchData);