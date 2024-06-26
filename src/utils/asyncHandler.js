//The asyncHandler function is a higher-order function designed to simplify error handling in asynchronous Express middleware

// const asyncHandler = () => {}

// using promises
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(err))
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