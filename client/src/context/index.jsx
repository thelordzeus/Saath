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
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      });

      console.log("contract call successful", data);
    } catch (error) {
      console.log("contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call("getCampasigns");

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      // Handle the error appropriately, possibly by setting an error state or displaying a message to the user.
    }
  };
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        connect,
        getCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
