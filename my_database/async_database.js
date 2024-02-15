const fs = require('fs');
const path = require('path');

/* 
*-------------------------------------- CREATE FUNCTIONS ---------------------------------------* 
*/
/**
 * Create a database folder at the specified path with the given name.
 * Throws an error if a folder with the same name already exists at the specified path.
 * @param {string} folderPath The path where the folder should be created.
 * @param {string} folderName The name of the folder to create.
 * @throws {Error} If a folder with the same name already exists at the specified path.
 */
function databaseCreation(folderPath, folderName) {
    // Create the full path by joining the folderPath and folderName
    const fullFolderPath = path.join(folderPath, folderName);

    // Check if the folder already exists at the specified path
    if (fs.existsSync(fullFolderPath)) {
        throw new Error(`Folder '${folderName}' already exists at '${folderPath}'.`);
    }

    // Create the folder asynchronously
    fs.mkdirSync(fullFolderPath);

    // Log success message
    console.log(`Folder '${folderName}' created successfully at '${folderPath}'.`);
}

/**
* Create a file inside the specified database folder with the given name.
* Throws an error if the specified database does not exist, or if a file with the same name already exists.
* @param {string} databasePath The path to the directory containing the databases.
* @param {string} databaseName The name of the database where the table should be created.
* @param {string} tableName The name of the table file to create.
* @throws {Error} If the specified database does not exist or if a file with the same name already exists.
*/
function createTable(databasePath, databaseName, tableName) {
   const databaseFolderPath = path.join(databasePath, databaseName);

   // Check if the specified database folder exists
   if (!fs.existsSync(databaseFolderPath)) {
       throw new Error(`Database '${databaseName}' does not exist at path '${databasePath}'.`);
   }

   // Check if the specified file already exists in the database folder
   const tableFilePath = path.join(databaseFolderPath, tableName);
   if (fs.existsSync(tableFilePath)) {
       throw new Error(`Table '${tableName}' already exists in the database '${databaseName}'.`);
   }

   // Create the file asynchronously
   fs.writeFileSync(tableFilePath, '');

   // Log success message
   console.log(`Table '${tableName}' created successfully in database '${databaseName}'.`);
}

/**
 * Function to create a record in a table within a database.
 * @param {String} databaseName The name of the database.
 * @param {String} tableName The name of the table where the record will be created.
 * @param {Object} record The record data to be stored.
 * @throws {Error} If the specified database or table doesn't exist.
 */
function createRecord(databasePath, databaseName, tableName, record) {
    const databasePath1 = path.join(databasePath, databaseName);
    const tablePath = path.join(databasePath1, tableName);
    
    if (!fs.existsSync(databasePath1)) {
        throw new Error(`Database '${databaseName}' does not exist.`);
    }

    if (!fs.existsSync(tablePath)) {
        throw new Error(`Table '${tableName}' does not exist in database '${databaseName}'.`);
    }

    let data = [];
    if (fs.existsSync(tablePath)) {
        const fileContent = fs.readFileSync(tablePath, "utf-8");
        if (fileContent.trim().length > 0) {
            data = JSON.parse(fileContent);
        }
    }

    data.push(record);

    fs.writeFileSync(tablePath, JSON.stringify(data, null, 2), "utf-8");

    console.log(`Record '${JSON.stringify(record)}' created successfully in table '${tableName}' of database '${databaseName}'.`);
}

/* 
*-------------------------------------- READ FUNCTIONS ---------------------------------------* 
*/

/**
 * Read the list of tables in a specified database.
 * @param {string} databasePath The path to the directory containing the databases.
 * @param {string} databaseName The name of the database to read.
 * @returns {Array<string>} An array containing the names of tables in the specified database.
 * @throws {Error} If the specified database does not exist.
 */
function readDatabase(databasePath, databaseName) {
    const databaseFolderPath = path.join(databasePath, databaseName);

    // Check if the specified database folder exists
    if (!fs.existsSync(databaseFolderPath)) {
        throw new Error(`Database '${databaseName}' does not exist at path '${databasePath}'.`);
    }

    // Read the list of files (tables) in the database folder
    const tables = fs.readdirSync(databaseFolderPath);
    return tables;
}


/**
 * Read the contents of a specified table in a database.
 * @param {string} databasePath The path to the directory containing the databases.
 * @param {string} databaseName The name of the database where the table is located.
 * @param {string} tableName The name of the table to read.
 * @returns {Array<Object>} An array containing the records (objects) in the specified table.
 * @throws {Error} If the specified database or table does not exist.
 */
function readTable(databasePath, databaseName, tableName) {
    const tableFilePath = path.join(databasePath, databaseName, tableName);
    console.log(tableFilePath)
    // Check if the specified table file exists
    if (!fs.existsSync(tableFilePath)) {
        throw new Error(`Table '${tableName}' does not exist in the database '${databaseName}'.`);
    }

    // Read the contents of the table file
    const tableContent = fs.readFileSync(tableFilePath, 'utf8').trim();
    console.log('Table content:', tableContent);

    if (tableContent === '') {
        return []; // Return an empty array if the file is empty
    }

    // Split the content into lines and parse each line as JSON
    const parsedContent = JSON.parse(tableContent);
    
    return parsedContent;
}


/** THIS FUNCTION IS NOT VALID
 * Read a specific record from a specified table in a database.
 * @param {string} databasePath The path to the directory containing the databases.
 * @param {string} databaseName The name of the database where the table is located.
 * @param {string} tableName The name of the table to read.
 * @param {number} recordIndex The index of the record to read (zero-based).
 * @returns {Object} The record object at the specified index in the table.
 * @throws {Error} If the specified database, table, or record does not exist.
 */
// function readRecord(databasePath, databaseName, tableName, recordIndex) {
//     const tableFilePath = path.join(databasePath, databaseName, tableName);

//     // Check if the specified table file exists
//     if (!fs.existsSync(tableFilePath)) {
//         throw new Error(`Table '${tableName}' does not exist in the database '${databaseName}'.`);
//     }

//     // Read the contents of the table file
//     const tableContent = fs.readFileSync(tableFilePath, 'utf8').trim().split('\n');

//     // Remove any empty lines
//     const nonEmptyLines = tableContent.filter(line => line.trim() !== '');

//     // Check if the record index is valid
//     if (recordIndex < 0 || recordIndex >= nonEmptyLines.length) {
//         throw new Error(`Record at index ${recordIndex} does not exist in table '${tableName}'.`);
//     }

//     // Parse the JSON record at the specified index
//     const record = JSON.parse(nonEmptyLines[recordIndex]);

//     return record;
// }

/* 
*-------------------------------------- UPDATE FUNCTIONS ---------------------------------------* 
*/

/**
 * Function to update the name of a table within a database.
 * @param {String} databaseName The name of the database.
 * @param {String} oldTableName The current name of the table.
 * @param {String} newTableName The new name for the table.
 * @throws {Error} If the specified database or table doesn't exist.
 *                If the new name already exists in the same directory.
 */
function updateTable(databaseName, oldTableName, newTableName) {
    const oldTablePath = path.join(databasePath, databaseName);
    const newTablePath = path.join(databasePath, newTableName);

    if (!fs.existsSync(databasePath)) {
        throw new Error(`Database '${databaseName}' does not exist.`);
    }

    if (!fs.existsSync(oldTablePath)) {
        throw new Error(`Table '${oldTableName}' does not exist in database '${databaseName}'.`);
    }

    if (fs.existsSync(newTablePath)) {
        throw new Error(`Table with name '${newTableName}' already exists in database '${databaseName}'.`);
    }

    fs.renameSync(oldTablePath, newTablePath);
    console.log(`Table '${oldTableName}' in database '${databaseName}' renamed to '${newTableName}' successfully!`);
}

/**
 * Function to update the data of a record within a table.
 * @param {String} databaseName The name of the database.
 * @param {String} tableName The name of the table.
 * @param {String} recordKey The key of the record to update.
 * @param {Object} newData The updated data for the record.
 * @throws {Error} If the specified database, table, or record doesn't exist.
 */
function updateRecord(databaseName, tableName, targetId, newData) {
    const databasefolderPath = path.join(databasePath,databaseName)
    const tablePath = path.join(databasefolderPath, tableName)
    console.log(databasefolderPath)
    console.log(tablePath);
    try {
        const existingData = fs.readFileSync(tablePath, "utf8");
        let dataArray = [];

        if (existingData) {
            dataArray = JSON.parse(existingData);
        }

        const targetIndex = dataArray.findIndex((item) => item.id === targetId);

        if (targetIndex !== -1) {
            dataArray[targetIndex] = { ...dataArray[targetIndex], ...newData };

            fs.writeFileSync(tablePath, JSON.stringify(dataArray, null, 2), "utf8");
            console.log(
                `Data with id '${targetId}' has been updated in the '${tableName}' table in the '${databaseName}' database.`
            );
        } else {
            console.log(
                `Data with id '${targetId}' not found in the '${tableName}' table in the '${databaseName}' database.`
            );
        }
    } catch (error) {
        console.error(
            `Error updating data in the '${tableName}' table in the '${databaseName}' database:`,
            error.message
        );
    }
}

/* 
*-------------------------------------- DELETE FUNCTIONS ---------------------------------------* 
*/

/**
 * Delete a database directory and all its contents.
 * @param {string} databasePath The path to the database directory to delete.
 * @throws {Error} If the database directory does not exist or cannot be deleted.
 */
function deleteDatabase(databasePathInput) {
    const databasePath = path.join(databasePathInput,databaseName)
    // Check if the specified directory exists
    if (!fs.existsSync(databasePath)) {
        throw new Error(`Database directory '${databasePath}' does not exist.`);
    }

    // Delete the database directory recursively
    fs.rmdirSync(databasePath, { recursive: true });
    console.log(`Database '${databasePath}' and all its contents have been deleted.`);
}

/**
 * Delete a table file from a database directory.
 * @param {string} databasePath The path to the database directory.
 * @param {string} tableName The name of the table file to delete.
 * @throws {Error} If the database directory or table file does not exist.
 */
function deleteTable(databasePathInput, tableName) {
    const databasePath = path.join(databasePathInput,databaseName)
    const tablePath = path.join(databasePath, tableName);
    console.log(tablePath);
    // Check if the table file exists
    if (!fs.existsSync(tablePath)) {
        throw new Error(`Table file '${tableName}' does not exist in database '${databasePath}'.`);
    }

    // Delete the table file
    fs.unlinkSync(tablePath);
    console.log(`Table '${tableName}' has been deleted from database '${databasePath}'.`);
}

/**
 * Delete a record from a table file.
 * @param {string} databasePath The path to the database directory.
 * @param {string} tableName The name of the table file.
 * @param {string} recordKey The key of the record to delete.
 * @throws {Error} If the database directory, table file, or record does not exist.
 */
function deleteRecord(databasePathInput, tableName, recordId) {
    const databasePath = path.join(databasePathInput,databaseName)
    const tablePath = path.join(databasePath, tableName);

    // Check if the table file exists
    if (!fs.existsSync(tablePath)) {
        throw new Error(`Table file '${tableName}' does not exist in database '${databasePath}'.`);
    }

    // Read the contents of the table file
    let tableData = fs.readFileSync(tablePath, 'utf8');
    tableData = JSON.parse(tableData);

    // Find the index of the record with the specified ID
    const recordIndex = tableData.findIndex(record => record.id === recordId);

    // Check if the record exists in the table
    if (recordIndex === -1) {
        throw new Error(`Record with ID '${recordId}' does not exist in table '${tableName}'.`);
    }

    // Remove the record from the array
    tableData.splice(recordIndex, 1);

    // Write the updated table data back to the file
    fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));
    console.log(`Record with ID '${recordId}' has been deleted from table '${tableName}'.`);
}
//unit testing

const databasePath = '/Users/atharva_zanwar/Desktop/Mean_stack_traning/database_trail'
const databaseName = 'myDatabase1';
const tableName = 'exampleTable.json';
const record = { id: 9, name: 'Johnny ', age: 20 };
const updateDatabasePath = '/Users/atharva_zanwar/Desktop/Mean_stack_traning'
const recordIndex = 0;
const recordKey = 2;
const newData = { name: 'atharva zanwar', age: 30 };

// databaseCreation(databasePath,databaseName)                 /*working fine*/
// createTable(databasePath, databaseName, tableName)          /*working fine*/
//createRecord(databasePath, databaseName, tableName, record);   /*working fine*/

/*
* To read database
*/
// const readDB = readDatabase(databasePath, databaseName);        /*working fine*/
// console.log(`Tables in database '${databaseName}':`, readDB);

/*
* To read tables
*/
// const readTables = readTable(databasePath, databaseName, tableName);  /*working fine*/
// console.log(`Records in table '${tableName}':`, readTables);

/*
* To read records  //DOESNT EXIST 
*/
// const readRecords = readRecord(databasePath, databaseName, tableName, recordIndex);
// console.log(`Record at index ${recordIndex} in table '${tableName}':`, readRecords);


/*
* To Delete records
*/
//deleteDatabase(databasePath);     /*working properly*/ 
// deleteTable(databasePath, tableName);  /*working properly*/ 
//deleteRecord(databasePath, tableName, recordKey); /*working properly*/ 

/*
* To Update records
*/

//updateTable(databaseName, tableName, 'newTableName'); /*Working properly*/
//updateRecord(databaseName, tableName, recordKey, newData); /*working properly*/