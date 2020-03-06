// Setting local variables, each movable header part should be here
let myDivHeader = document.getElementById("mydivheader");
let movingDivHeader = document.getElementById("movingDivHeader");
let commandsDivHeader = document.getElementById("commandsDivHeader");
let movableHeaders = new Array(myDivHeader, movingDivHeader, commandsDivHeader);

// Giving a unique key to each movable header part, in order to update the indexeddb
let index = 1;
movableHeaders.forEach(movableHeader => {
  movableHeader.setAttribute("positionsId", index++);
});

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function() {
  // Create an onmouseup handler so that when the form is submitted the addOrUpdateData() function is run
  movableHeaders.forEach(movableHeader =>
    movableHeader.addEventListener("mouseup", addOrUpdateData)
  );

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
    // different data items in the store, in order to set the positions
    let objectStore = db
      .transaction("positions_os")
      .objectStore("positions_os");
    objectStore.openCursor().onsuccess = function(e) {
      // Get a reference to the cursor
      let cursor = e.target.result;

      // If there is still another data item to iterate through, keep running this code
      if (cursor) {
        if (cursor.value.sectionTitle != "") {
          let curentElem = document.getElementById(cursor.value.sectionTitle);
          curentElem.style.top = cursor.value.positionTop;
          curentElem.style.left = cursor.value.positionLeft;
        } else {
          // supprimer l'element de la bdd
          console.log(
            "l'element d'id : " +
              cursor.value.id +
              " doit etre retire de la bdd"
          );
        }
        cursor.continue();
      }
      // if there are no more cursor items to iterate through, say so
      console.log("Notes all displayed");
    };
  };

  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function(e) {
    // Grab a reference to the opened database
    let db = e.target.result;

    // Create an objectStore to storethe positions in (basically like a single table)
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

  // Define the addOrUpdateData() function
  function addOrUpdateData(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();
    let elementId = Number(e.target.getAttribute("positionsId"));

    let container = e.target.parentNode.parentNode;
    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let newItem = {
      sectionTitle: container.id,
      positionLeft: container.style.left,
      positionTop: container.style.top,
      id: elementId // key : id of the element to update
    };

    console.log(newItem);
    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(["positions_os"], "readwrite");

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore("positions_os");

    // Make a request to put (adds if it doesn't exist or update) our newItem object to the object store
    var request = objectStore.put(newItem);
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
