import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xe408c3f3533f3F2fEf65bc3435c80a2157feB8b6"
  );

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          ethers.utils.parseUnits(form.target.toString(), "ether"), // target, converting to BigNumber
          Math.floor(new Date(form.deadline).getTime() / 1000), // deadline, converting to UNIX timestamp in seconds
          form.image, // image URL
        ],
      });

      console.log("contract call successful", data);
    } catch (error) {
      console.log("contract call failed", error);
    }
  };

  return (
    <StateContext.Provider
      value={{ address, contract, createCampaign: publishCampaign, connect }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
