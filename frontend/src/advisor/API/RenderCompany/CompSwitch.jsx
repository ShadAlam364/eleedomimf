import { lazy } from "react";
import { useParams } from "react-router-dom";
const NonMotorInsurance = lazy(() =>
  import("../../../components/homeComponets/NonMotorInsurance")
);
import NotFound from "../../../notFound/NotFound.jsx";
import TwMain from "../TataAIG/TW/TwMain.jsx";
import CommVeh from "../TataAIG/CommercialVeh/CommVeh.jsx";
import PvtCarControl from "../MagmaHDI/Car/Main/PvtCarControl.jsx";
import QuotationForm from "../MagmaHDI/CommVehicle/Quotation/QuotationForm.jsx";
import ProposalForm from "../MagmaHDI/CommVehicle/Proposal/ProposalForm.jsx";
import KycForm from "../MagmaHDI/CommVehicle/Kyc/KycForm.jsx";
import PaymentForm from "../MagmaHDI/CommVehicle/Payment/PaymentForm.jsx";
import PolicyDown from "../MagmaHDI/CommVehicle/DwnldPolicy/PolicyDown.jsx";
import QuoteCar from "../TataAIG/CAR/CarQuoteform/QuoteCar.jsx";
import PaymentTaig from "../TataAIG/CAR/CarPayment/PaymentTaig.jsx";
import Proposer from "../TataAIG/CAR/CarProposer/Proposer.jsx";
import KycParent from "../TataAIG/CAR/TataCkyc/KycParent/KycParent.jsx";

function CompSwitch() {
  // const { selectedOption, menuItems, setSelectedOption } = useOutletContext();
  const { insuranceName, category, selectedCategory, path } =
    useParams();
 
  // Mapping for Tata AIG components
  const tataAigComponents = {
    motor: {
    //   "pvt-car1": <CarMain
    //   menuItems={menuItems}
    //   selectedOption={selectedOption}
    //  setSelectedSubOption={setSelectedSubOption}
    //   setSelectedOption={setSelectedOption}
    //   selectedSubOption={selectedSubOption}
    // />,
      "pvt-car": {
        quotation: <QuoteCar />,
        proposal: <Proposer />,
        kyc: <KycParent />,
        payment: <PaymentTaig />,
        policy: <PolicyDown />,
      },
      "2-wheeler": <TwMain />,
      "commercial-vehicle": <CommVeh />,
    },
    nonmotor: <NonMotorInsurance />,
    health: <NonMotorInsurance />,
  };

  // Mapping for Magma HDI components
  const magmaHdiComponents = {
    motor: {
      "pvt-car": {
        quotation: <QuotationForm />,
        proposal: <ProposalForm />,
        kyc: <KycForm />,
        payment: <PaymentForm />,
        policy: <PolicyDown />,
      },
      "2-wheeler": {
        quotation: <PvtCarControl />,
        proposal: <ProposalForm />,
        kyc: <KycForm />,
        payment: <PaymentForm />,
        policy: <PolicyDown />,
      },
      "commercial-vehicle": {
        quotation: <QuotationForm />,
        proposal: <ProposalForm />,
        kyc: <KycForm />,
        payment: <PaymentForm />,
        policy: <PolicyDown />,
      },
    },
    nonmotor: <NonMotorInsurance />,
    health: <NonMotorInsurance />,
  };

  // Render content based on insuranceName, category, and formattedSelectedOption
  const renderContent = () => {
    if (insuranceName === "tata_aig") {
      const categoryComponents = tataAigComponents[category];
      
      // if (categoryComponents && typeof categoryComponents === "object") {
      //   return categoryComponents[formattedSelectedOption] || <NotFound />;
      // }
      if (categoryComponents && typeof categoryComponents === "object") {
        const selectedComponent = categoryComponents[selectedCategory];
        if (selectedComponent && typeof selectedComponent === "object") {
          console.log("selectedComponent", path, selectedComponent);
          
          return selectedComponent[path] || <NotFound />;
        }
        return selectedComponent || <NotFound />;
      }
      return categoryComponents || <NotFound />;
      
    } else if (insuranceName === "magma_hdi") {
      const categoryComponents = magmaHdiComponents[category];

      if (categoryComponents && typeof categoryComponents === "object") {
        const selectedComponent = categoryComponents[selectedCategory];
        if (selectedComponent && typeof selectedComponent === "object") {
          return selectedComponent[path] || <NotFound />;
        }
        return selectedComponent || <NotFound />;
      }
      return categoryComponents || <NotFound />;
    }
    return <NotFound />;
  };

  return renderContent();
}

export default CompSwitch;
