// Helper function for catching errors
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
