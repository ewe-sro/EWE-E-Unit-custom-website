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
  for (let row in chargingData.data.reverse()) {
    let chargingObj = chargingData.data[row];

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
      newRow.querySelector(".start-timestamp").innerHTML = convertTimestampToDate(chargingObj.startTimestamp, "datetime");
      newRow.querySelector(".end-timestamp").innerHTML = convertTimestampToDate(chargingObj.endTimestamp, "datetime");
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
  let input, filter, table, tr, td, txtValue;
  input = document.querySelector("#table-search");
  filter = input.value.toUpperCase();
  table = document.querySelector("#charging-data tbody");
  tr = table.querySelectorAll("tr");

  // Loop through all table rows
  for (let row of tr) {
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



///////////////////////////
/// GET TIMEZONE OFFSET ///
///////////////////////////

const getTimezoneOffset = () => {
  const today = new Date();
  const offsetMinutes = today.getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;

  return offsetHours;
}

///////////////////////////
///                     ///
///////////////////////////



/////////////////////////////////
/// CONVERT TIMESTAMP TO DATE ///
/////////////////////////////////

function convertTimestampToDate(timestamp, type) {
  if (timestamp === null || timestamp === undefined || timestamp == "") {
      return " ";
  }

  if (timestamp === "") return "";

  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  const timezoneOffset = getTimezoneOffset();

  // Extract date components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = date.getDate();
  const hour = date.getHours() + timezoneOffset;
  const minutes = date.getMinutes();

  // Construct the date string in desired format
  let formattedDate

  if (type === "datetime") {
      formattedDate = `${day.toString().padStart(2, '0')}. ${month.toString().padStart(2, '0')}. ${year} ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  } else {
      formattedDate = `${day.toString().padStart(2, '0')}. ${month.toString().padStart(2, '0')}. ${year}`
  }

  return formattedDate;
}

/////////////////////////////////
///                           ///
/////////////////////////////////



// Initialize charging data
initChargingData();

// Add eventListener to search input
let searchInput = document.querySelector("#table-search");
searchInput.addEventListener("input", searchData);