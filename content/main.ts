import { logger } from "../src/logger";

export const main = (): string => {
    logger.error("Error log.");
    logger.warning("Warning log.");
    logger.info("Info log.");

    return "Return value";
};
