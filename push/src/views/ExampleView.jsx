import ExampleComponent from "../components/ExampleComponent";
import JobRequirementsTable from "../components/client/requirements/JobRequirementsTable";

import Requirement from "../components/client/requirements/Requirement";

/*
This view page is only for demo purpose
*/

const ExampleView = () => {

  return (
    <>
    {/* <ExampleComponent /> */}
    <Requirement />
    <JobRequirementsTable/>
    </>
  );

};

export default ExampleView;
