import * as React from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
// import { I18nextProvider } from "react-i18next";
function App() {
  return (
    <>
      {/* <I18nextProvider i18n={i18n}> */}
        <DashboardLayout>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </DashboardLayout>
      {/* </I18nextProvider> */}
    </>
  );
}

export default App;
