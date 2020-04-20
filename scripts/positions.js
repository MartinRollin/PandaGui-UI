// Create an instance of a db object for us to store the open database in
let db;

window.onload = function () {
  // Setting local variables, each movable header part is stored here

  let movableHeaders = $("[id$=Header]");

  // Giving a unique key to each movable header part, in order to update the indexeddb
  movableHeaders.each(function (index) {
    $(this).attr("positionsId", index);
  });
  // Open our database; it is created if it doesn't already exist
  // (see onupgradeneeded below)
  let request = window.indexedDB.open("positions_db", 1);

  // onerror handler signifies that the database didn't open successfully
  request.onerror = function () {
    console.log("Database failed to open");
  };

  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function () {
    console.log("Database opened succesfully");
    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;
    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store, in order to set the positions
    let objectStore = db
      .transaction("positions_os")
      .objectStore("positions_os");
    objectStore.openCursor().onsuccess = function (e) {
      // Get a reference to the cursor
      let cursor = e.target.result;
      // If there is still another data item to iterate through, keep running this code
      if (cursor) {
        if (
          cursor.value.sectionTitle != "" &&
          cursor.value.id < movableHeaders.length
        ) {
          let curentElem = document.getElementById(cursor.value.sectionTitle);
          console.log(
            $(`[id=${cursor.value.sectionTitle}Header]`).attr("positionsId")
          );
          if (curentElem == null) {
            console.log(
              "element of id : " +
                cursor.value.id +
                " should be removed from the database" +
                cursor.value.sectionTitle
            );
          } else {
            console.log(
              "element of id cursor : " +
                cursor.value.id +
                " est changée " +
                cursor.value.sectionTitle +
                " identifiant de" +
                curentElem.id +
                " identifiant de" +
                curentElem.positionsId
            );
            curentElem.style.top = cursor.value.positionTop;
            curentElem.style.left = cursor.value.positionLeft;
            curentElem.childNodes[3].style.display = cursor.value.display;
            $("#" + curentElem.id).css("z-index", cursor.value.index);
          }
        } else {
          // supprimer l'element de la bdd
          console.log(
            "element of id : " +
              cursor.value.id +
              " should be removed from the database"
          );
        }
        cursor.continue();
      }
    };
  };

  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function (e) {
    // Grab a reference to the opened database
    let db = e.target.result;

    // Create an objectStore to storethe positions in (basically like a single table)
    // including a auto-incrementing key
    let objectStore = db.createObjectStore("positions_os", {
      keyPath: "id",
      autoIncrement: true,
    });

    // Define what data items the objectStore will contain
    objectStore.createIndex("sectionTitle", "sectionTitle", { unique: false });
    objectStore.createIndex("positionLeft", "positionLeft", { unique: false });
    objectStore.createIndex("positionTop", "positionTop", { unique: false });
    objectStore.createIndex("display", "display", { unique: false });
    objectStore.createIndex("index", "index", { unique: false });

    console.log("Database setup complete");
  };

  // Create an onmouseup handler so that when the form is submitted the addOrUpdateData() function is run
  movableHeaders.mouseup(addOrUpdateData);

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
      display: container.childNodes[3].style.display,
      index: $("#" + container.id).css("z-index"),
      id: elementId, // key : id of the element to update
    };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(["positions_os"], "readwrite");

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore("positions_os");

    // Make a request to put (adds if it doesn't exist or update) our newItem object to the object store
    var request = objectStore.put(newItem);
    request.onsuccess = function () {
      console.log("Successful save");
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function () {
      console.log("Transaction completed: database modification finished.");
    };

    transaction.onerror = function () {
      console.log("Transaction not opened due to error");
    };
  }
};
