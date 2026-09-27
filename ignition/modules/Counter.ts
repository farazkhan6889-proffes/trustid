import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TrustIDModule = buildModule("TrustIDModule", (m) => {
  const trustID = m.contract("TrustID");

  return { trustID };
});

export default TrustIDModule;