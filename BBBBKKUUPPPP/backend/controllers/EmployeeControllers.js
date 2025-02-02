const Employee = require('../models/Employee')

const store = async (req, res, next) => {
    const { name, designation, email, phone, age, userID } = req.body;

    // Validate incoming data
    if (!name || !designation || !email || !phone || !age || !userID) {
        return res.status(400).json({
            message: 'Missing required fields',
        });
    }

    try {
        const existingEmployee = await Employee.findOne({ $or: [{ email }, { phone }] });

        if (existingEmployee) {
            // Employee with the provided email or phone number already exists
            return res.json({
                message: 'EMPLOYEE_ALREADY_EXISTS',
            });
        }

        // If the code reaches here, it means the email and phone are not in use
        // You can proceed with user registration logic here

        let employee = new Employee({
            name,
            designation,
            email,
            phone,
            age,
            userID,
        });

        if (req.file) {
            employee.picture = req.file.path;
        }

        employee.save()
            .then(response => {
                res.json({
                    message: 'ADDED_SUCCESSFULLY',
                    response,
                });
            })
            .catch(error => {
                // Log the error for debugging purposes
                console.error(error);
                res.json({
                    message: 'ERROR_OCCURRED',
                    error: error.message, // Include specific error message
                });
            })
            .finally(() => {
                next(); // Call next() after user registration logic is complete
            });
    } catch (error) {
        return res.json({
            message: 'AN_ERROR_OCCURRED',
        });
    }
};

// update an employee
const update = (req, res, next) => {
    try {
        let employeeID = req.body.employeeID
        let updatedData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            designation: req.body.designation,
            age: req.body.age,
            picture: req.body.picture,
            userID: req.body.userID
        };
        if (req.file) {
            updatedData.picture = req.file.path
        }
        Employee.findByIdAndUpdate(employeeID, { $set: updatedData })
            .then(user => {
                return res.json({
                    message: 'UPDATE_SUCCESSFULLY',
                })
            })
            .catch(error => {
                return res.json({
                    message: 'ERROR_OCCURRED'
                })
            })
    } catch (err) {
        console.log(err)
    }
}

// Delete an employee
const destroy = (req, res, index) => {
    // let employeeID = req.body.employeeID
    const { id: employeeID } = req.params;
    Employee.findByIdAndRemove(employeeID)
        .then(() => {
            res.json({
                message: 'DELETE_SUCCESSFULLY'
            })
        })
        .catch(error => {
            res.json({
                message: 'ERROR_OCCURRED'
            })
        })
}

// Show single Employee
const show = (req, res, next) => {
    const { id: employeeID } = req.params;
    Employee.findById(employeeID)
        .then(response => {
            res.json({
                response: response,
            });
        })
        .catch(error => {
            res.json({
                message: 'AN_ERROR_OCCURRED'
            });
        });
};

// Show Related User employees
const showRelatedUser = (req, res, next) => {
    const { id: userID } = req.params;
    Employee.find({ userID })
        .then(users => {
            if (users.length > 0) {
                res.json({ users });
            } else {
                res.json({ message: 'No users found with the specified userID' });
            }
        })
        .catch(error => {
            res.json({ message: 'An error occurred!' });
        });
};



// Show products quantity
// const products = (req, res, next) => {
//     if (req.query.page && req.query.limit) {
//         Employee.paginate({}, { page: req.query.page, limit: req.query.limit })
//             .then(response => {
//                 res.json({
//                     response
//                 })
//             })
//             .catch(error => {
//                 res.json({
//                     message: 'An error Occurred!' + error
//                 })
//             })
//     } else {
//         Employee.find()
//             .then(response => {
//                 res.json({
//                     response
//                 })
//             })
//             .catch(error => {
//                 res.json({
//                     message: 'An error Occurred!' + error
//                 })
//             })
//     }
// }

module.exports = {
    // index,
    show,
    store, update, destroy, showRelatedUser,
    // products
}


























// Show the list of Employee
// const index = (req, res, next) => {
//     if (req.query.page && req.query.limit) {
//         Employee.paginate({}, { page: req.query.page, limit: req.query.limit })
//             .then(response => {
//                 res.json({
//                     response
//                 })
//             })
//             .catch(error => {
//                 res.json({
//                     message: 'An error Occurred!' + error
//                 })
//             })
//     } else {
//         Employee.find()
//             .then(response => {
//                 res.json({
//                     response
//                 })
//             })
//             .catch(error => {
//                 res.json({
//                     message: 'An error Occurred!' + error
//                 })
//             })
//     }
// }





// add new employee
// const storeTT = (req, res, next) => {
//     let employee = new Employee({
//         name: req.body.name,
//         designation: req.body.designation,
//         email: req.body.email,
//         phone: req.body.phone,
//         age: req.body.age,
//         userID: req.body.userID
//     })
//     if (req.file) {
//         employee.picture = req.file.path
//     }
//     // if (req.files) {
//     //     let path = ''
//     //     req.files.forEach(function (files, index, arr) {
//     //         path = path + files.path + ','
//     //     })
//     //     path = path.substring(0, path.lastIndexOf(','))
//     //     employee.picture = path
//     // }
//     employee.save()
//         .then(response => {
//             res.json({
//                 message: 'ADDED_SUCCESSFULLY', response: response
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: 'ERROR_OCCURRED', error: error
//             })
//         })
// }



// Update single employee
// let employeeID = req.body.employeeID
// const show = (req, res, next) => {
//     const { id: employeeID } = req.params;
//     Employee.findById(employeeID)
//         .then(response => {
//             res.json({
//                 response
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: 'An error Occurred!'
//             })
//         })
// }




// const update = async (req, res, next) => {
//     const { name, designation, email, phone, age, userID } = req.body;

//     // Validate incoming data
//     if (!name || !designation || !email || !phone || !age || !userID) {
//         return res.status(400).json({
//             message: 'Missing required fields',
//         });
//     }

//     try {
//         const existingEmployee = await Employee.findOne({ $or: [{ email }, { phone }] });
//         console.log("🚀 ~ file: EmployeeControllers.js:204 ~ updateN ~ existingEmployee:", existingEmployee)

//         if (existingEmployee) {
//             // Employee with the provided email or phone number already exists
//             return res.json({
//                 message: 'EMPLOYEE_ALREADY_EXISTS',
//             });
//         }

//         // If the code reaches here, it means the email and phone are not in use
//         // You can proceed with user registration logic here

//     } catch (error) {
//         return res.json({
//             message: 'AN_ERROR_OCCURRED',
//         });
//     }
// };