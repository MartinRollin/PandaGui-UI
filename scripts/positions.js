// setting local variables
let myDiv = document.getElementById("mydiv");
let movingDiv = document.getElementById("movingDiv");

myDiv.setAttribute("positionsId", 0);
// Create an instance of a db object for us to store the open database in
let db;

window.onload = function() {
  // Open our database; it is created if it doesn't already exist
  // (see onupgradeneeded below)
  let request = window.indexedDB.open("positions_db", 1);
  // onerror handler signifies that the database didn't open successfully

  request.onerror = function() {
    console.log("Database failed to open");
  };

  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function() {
    console.log("Database opened succesfully");
    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;
    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store
    let objectStore = db
      .transaction("positions_os")
      .objectStore("positions_os");
    objectStore.openCursor().onsuccess = function(e) {
      // Get a reference to the cursor
      let cursor = e.target.result;

      // If there is still another data item to iterate through, keep running this code
      if (cursor) {
        console.log(cursor.value);
        let curentElem = document.getElementById(cursor.value.sectionTitle);
        curentElem.style.top = cursor.value.positionTop;
        curentElem.style.left = cursor.value.positionLeft;
        cursor.continue();
      } else {
        console.log("aucunes positions enregistrées pour le moment");
      }
      // if there are no more cursor items to iterate through, say so
      console.log("Notes all displayed");
    };
  };
  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function(e) {
    // Grab a reference to the opened database
    let db = e.target.result;

    // Create an objectStore to store our notes in (basically like a single table)
    // including a auto-incrementing key
    let objectStore = db.createObjectStore("positions_os", {
      keyPath: "id",
      autoIncrement: true
    });

    // Define what data items the objectStore will contain
    objectStore.createIndex("sectionTitle", "sectionTitle", { unique: false });
    objectStore.createIndex("positionLeft", "positionLeft", { unique: false });
    objectStore.createIndex("positionTop", "positionTop", { unique: false });

    console.log("Database setup complete");
  };

  // Create an onsubmit handler so that when the form is submitted the addData() function is run
  myDiv.addEventListener("mouseup", addOrUpdateData);

  // Define the addData() function
  function addOrUpdateData(e) {
    console.log(e.target.parentNode.id);
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let newItem = {
      sectionTitle: e.target.parentNode.id,
      positionLeft: e.target.parentNode.style.left,
      positionTop: e.target.parentNode.style.top
    };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(["positions_os"], "readwrite");

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore("positions_os");
    let elementId = Number(e.target.parentNode.getAttribute("positionsId"));
    console.log(elementId);
    // Make a request to add our newItem object to the object store
    var request = objectStore.add(newItem);
    request.onsuccess = function() {
      console.log("reussite du stockage");
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function() {
      console.log("Transaction completed: database modification finished.");
    };

    transaction.onerror = function() {
      console.log("Transaction not opened due to error");
    };
  }
};
