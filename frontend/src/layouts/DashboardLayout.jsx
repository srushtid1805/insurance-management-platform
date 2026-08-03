import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Desktop sidebar */}
      <div
        className="d-none d-lg-block bg-dark"
        style={{
          width: "250px",
          minHeight: "100vh",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          alignSelf: "flex-start"
        }}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {showSidebar && (
        <>
          <div
            className="position-fixed top-0 start-0 bg-dark h-100"
            style={{
              width: "250px",
              zIndex: 1050
            }}
          >
            <Sidebar
              closeSidebar={() => setShowSidebar(false)}
            />
          </div>

          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowSidebar(false)}
          />
        </>
      )}

      <div className="flex-grow-1 min-vh-100 overflow-hidden">
        <Topbar
          openSidebar={() => setShowSidebar(true)}
        />

        <main className="p-2 p-sm-3 p-md-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;