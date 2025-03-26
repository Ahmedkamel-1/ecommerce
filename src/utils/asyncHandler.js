export const asyncHandler = (controller) => {
     return (req, res, next) => {
         try {
             Promise.resolve(controller(req, res, next)).catch(next);
         } catch (error) {
             next(error);
         }
     };
 };