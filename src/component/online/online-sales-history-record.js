// import { BiRupee } from "react-icons/bi";
import { useParams } from "react-router-dom";

import { OnlineRecord } from "./component/OnlineRecord";

import { OfflineRecord } from "./component/OfflineRecord";
const OnlineSalesHistoryRecord = () => {
  const { orderID } = useParams();
  const { customer_address } = useParams();
  const { order_type } = useParams();

  if (order_type == "Online")
    return (
      <OnlineRecord orderID={orderID} customer_address={customer_address} />
    );
  return (
    <OfflineRecord orderID={orderID} customer_address={customer_address} />
  );
};

export default OnlineSalesHistoryRecord;
