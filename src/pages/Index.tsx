
// No need to import Header or wrap with layout here. Layout provides both.
import { Balance } from "@/components/Balance";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Onramper } from "@/components/Onramper";
import { XMRTInteraction } from "@/components/XMRTInteraction";
import { UserToUserTransfer } from "@/components/UserToUserTransfer";
import { ColdStorage } from "@/components/ColdStorage";
import { Staking } from "@/components/Staking";

const Index = () => {
  return (
    <>
      <Balance />
      <XMRTInteraction />
      <UserToUserTransfer />
      <ColdStorage />
      <Staking />
      <Onramper />
      <TransactionHistory />
    </>
  );
};

export default Index;
