const { StatusCodes } = require("http-status-codes");

const dynamicEndpointMiddleware = async (req, res, next) => {
  const availableEndpoints = {
    exercise: "exercise",
    name: "name",
    target: "target",
    equipment: "equipment",
    targetList: "targetList",
    equipmentList: "equipmentList",
    bodyPartList: "bodyPartList",
    bodyPart: "bodyPart",
  };

  const pathParts = req.path.split("/").filter(Boolean); // Split and remove empty parts
  const basePath = pathParts[0]; // "bodyPartList" or "bodyPart"
  const dynamicSegment = pathParts[1]; // e.g., "{bodyPart}" if it exists

  if (!availableEndpoints[basePath]) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, errors: ["Invalid endpoint"] });
  }

  const endpoint = dynamicSegment
    ? `${availableEndpoints[basePath]}/${dynamicSegment}`
    : availableEndpoints[basePath];

  req.endpoint = endpoint; // Attach the endpoint to the request object

  next();
};

module.exports = dynamicEndpointMiddleware;
