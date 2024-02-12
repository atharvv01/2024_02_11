/** This is attempt to creater a very basic database using 
 * file handeling in javascript , and perform CRUD operations
 * on it
 * @author Atharva
 */

const fs = require('fs')
const path = require('path');

/**This is function to create a database
 * @param {String} Database_Name the name of the database
 * @throws {Error} if there is problem while creating database
 */
function createDB(Database_Name) {
    // Attempt to convert folderName to a string
    const DBNameString = String(Database_Name);

    // Check if the conversion was successful
    if (DBNameString !== Database_Name) {
        throw new Error('Error: folderName must be convertible to a string.');
    }

    const DB = DBNameString
    fs.mkdir(DB, (err) => {
        if (err) {
            console.error("There is some error while creating database", err);
        }
        else {
            console.log("Database created successfully");
        }
    })
}

/**This is a function to read a database
 * @param {String} Database the database that you want to read
 * @throws {Error} if there is some issue while reading the file
 */
function readDatabase(Database) {
    // Attempt to convert the database name into string
    const DBstring = String(Database)

    // Check if the conversion is successful
    if (DBstring !== Database) {
        throw new Error(" Name must be a string")
    }

    fs.readdir(DBstring, (err, files) => {
        if (err) {
            console.error("There was some error while reading the database")
        }
        else {
            console.log("Database read successfully", files);
        }
    })
}

/**This is a function to update a database
 * @param {String} Database the current name of the database
 * @param {String} newName the new name that you want to keep
 * @throws {Error} when there is some error while updating the database
 */
function updateDB(Database, newName) {
    // Attempt to convert folder names to strings
    const DBstring = String(Database);
    const newNameString = String(newName);

    // Check if the conversions were successful
    if (DBstring !== Database || newNameString !== newName) {
        throw new Error('Error: the names must be strings.');
    }

    fs.rename(DBstring, newNameString, (err) => {
        if (err) {
            console.error(`Error renaming folder '${DBstring}' to '${newNameString}':`, err);
        } else {
            console.log(`Folder '${DBstring}' renamed to '${newNameString}' successfully!`);
        }
    });
}

/**This is a function to delete a database
 * @param {String} Database the database that you want to delete
 * @throws {Error} when there is some error while deleting the database
 */
function deleteDatabase(Database) {
    // Attempt to convert database name to a string
    const DBstring = String(Database);

    // Check if the conversion was successful
    if (DBstring !== Database) {
        throw new Error('Error: Database name must be convertible to a string.');
    }

    // Delete the database folder
    fs.rmdir(DBstring, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error deleting database '${DBstring}':`, err);
        } else {
            console.log(`Database '${DBstring}' deleted successfully!`);
        }
    });
}

/**This is a function to create a table in the specified database
 * @param {String} Database the database where you want to create the table
 * @param {String} Table_Name the name of the table you want to create
 * @throws {Error} if there is some error while creating the table
 */
function createTable(Database, Table_Name) {
    // Attempt to convert folderName to a string
    const DBString = String(Database);

    // Check if the conversion was successful
    if (DBString !== Database) {
        throw new Error('Error: folderName must be convertible to a string.');
    }

    // Attempt to convert Table Name to string
    const TableString = String(Table_Name)

    // Check if the the conversion was successful
    if (TableString !== Table_Name) {
        throw new Error('Error: folderName must be convertible to a string.')
    }

    // create a path where the table has to be created
    const filePath = path.join(DBString, TableString)

    fs.writeFile(filePath, '', 'utf8', (err) => {
        if (err) {
            console.error(`Error creating table '${filePath}':`, err);
        } else {
            console.log(`Table '${filePath}' created successfully!`);
        }
    })
}

/**Function to read the table
 * @param {String} Database the db in which the table is present
 * @param {String} Table_Name the table that you want to read
 * @throws {Error} when there is some issue while reading the table
 */
function readTable(Database, Table_Name) {
    // Attempt to convert folderName to a string
    const DBString = String(Database);

    // Check if the conversion was successful
    if (DBString !== Database) {
        throw new Error('Error: Name must be a string.');
    }

    // Attempt to convert Table Name to string
    const TableString = String(Table_Name)

    // Check if the the conversion was successful
    if (TableString !== Table_Name) {
        throw new Error('Error: folderName must be convertible to a string.')
    }

    // Construct the full path to the file
    const filePath = path.join(DBString, TableString);

    // Read the content of the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file '${filePath}':`, err);

        } else {
            console.log(`File '${filePath}' read successfully!`, data);

        }
    });
}

/**Function to update the table
 * @param {String} Database the database that has your folder
 * @param {String} Table_Name the table that you want to update
 * @param {Object} newRecord the new record that you want to add
 * @throws {Error} when there is some error while updating the record
 */
function updateTable(Database, Table_Name, newRecord) {
    // Attempt to convert folderName and fileName to strings
    const DBstring = String(Database);
    const TableString = String(Table_Name);

    // Check if the conversions were successful
    if (DBstring !== Database || TableString !== Table_Name) {
        throw new Error('Error: Database and Table names must be strings.');
    }

    // Construct the full path to the file
    const filePath = path.join(DBstring, TableString);

    // Read the existing content of the file
    fs.readFile(filePath, 'utf8', (err, existingRecord) => {
        if (err) {
            console.error(`Error reading file '${filePath}' for update:`, err);
        } else {
            let existingData;

            try {
                // Try parsing existing data as JSON
                existingData = JSON.parse(existingRecord);

                // Check if existingData is an array
                if (!Array.isArray(existingData)) {
                    // If not an array, create an array with the existing data
                    existingData = [existingData];
                }

                // Add the new record to the array
                existingData.push(newRecord);

                // Convert the updated array to JSON string
                const updatedData = JSON.stringify(existingData, null, 2);

                // Write the updated data to the file
                fs.writeFile(filePath, updatedData, 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error(`Error updating file '${filePath}':`, writeErr);
                    } else {
                        console.log(`File '${filePath}' updated successfully!`);
                    }
                });
            } catch (parseError) {
                // If parsing fails, assume existingData is not an array
                console.error(`Error parsing JSON in file '${filePath}':`, parseError);
            }
        }
    });
}

/**This is a function to delete a table from a database
 * @param {String} Database the database where the table exists
 * @param {String} Table_Name the name of the table you want to delete
 * @throws {Error} when there is some error while deleting the table
 */
function deleteTable(Database, Table_Name) {
    // Attempt to convert folderName and fileName to strings
    const DBstring = String(Database);
    const TableString = String(Table_Name);

    // Check if the conversions were successful
    if (DBstring !== Database || TableString !== Table_Name) {
        throw new Error('Error: Database and Table names must be strings.');
    }

    // Construct the full path to the file
    const filePath = path.join(DBstring, TableString);

    // Delete the table file
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting table '${filePath}':`, err);
        } else {
            console.log(`Table '${filePath}' deleted successfully!`);
        }
    });
}

/**Function to write records in a table
 * @param {String} Database the database that has the table
 * @param {String} Table_Name the table that you want to write the records in
 * @param {Object} record the record that you want to put in the table
 */
function createRecord(Database, Table_Name, record, callback) {
    // Attempt to convert folderName to a string
    const DBstring = String(Database);

    // Check if the conversion was successful
    if (DBstring !== Database) {
        throw new Error('Error: folderName must be convertible to a string.');
    }

    // Attempt to convert Table Name to string
    const TableString = String(Table_Name)

    // Check if the conversion was successful
    if (TableString !== Table_Name) {
        throw new Error('Error: Table_Name must be convertible to a string.')
    }

    // Construct the full path to the file
    const filePath = path.join(DBstring, TableString);

    // Convert JSON objects to a JSON string
    const jsonString = JSON.stringify(record, null, 2); // The third parameter (2) is for indentation

    // Write the JSON string to the file
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing record to table '${filePath}':`, err);

        } else {
            console.log(`record written to table '${filePath}' successfully!`);

        }
    });
}







function createDataBase() {
    createDB('Google');
}
function tableCreation() {
    createTable('Google', 'employee.json')
}
function recordCreation() {
    // creating a record in json format
    const record = {
        key1: 'value1',
        key2: 'value2',
        key3: [1, 2, 3],
    };
    createRecord('Google', 'employee.json', record)
}
function TableRead() {
    readTable('Google', 'employee.json')
}
function readDB() {
    readDatabase('Google')
}
function updateDataBase() {
    updateDB('Google', 'Amazon')
}
function tableUpdation() {
    const new_record = {
        key1: 'value69',
        key2: 'value96',
        key3: [4, 5, 6],
    };

    updateTable('Amazon', 'employee.json', new_record)
}
function tableDeletion(){
    deleteTable('employee.json')
}
// function databaseDelete()
// {
//     deleteDatabase('Amazon')
// }

createDataBase()
tableCreation()
recordCreation()
TableRead()
readDB()
updateDataBase()
tableUpdation()
tableDeletion()
// databaseDelete()
