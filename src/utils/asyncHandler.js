//The asyncHandler function is a higher-order function designed to simplify error handling in asynchronous Express middleware
//Without asyncHandler, you need to use try...catch blocks in every asynchronous route handler to catch errors and pass them to the next function. This can lead to repetitive and cluttered code.

// const asyncHandler = () => {}

// using promises
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error))
    }
}    

export{asyncHandler}

// using try catch
// const asyncHandler= (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)        
//     } catch (error) {
//         res.status(error.code || 500).jason({
//             success: false,
//             message: err.message
//         })
//     }
// }