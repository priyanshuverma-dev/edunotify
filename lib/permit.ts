import { Permit } from "permitio";

/**
 * Permit instance
 */

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PDP_URL,
});

export default permit;
