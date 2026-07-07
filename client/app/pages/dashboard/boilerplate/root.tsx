import { Outlet } from "react-router";

import Header from "./header";
import Sidebar from "./sidebar";


export default function Boilerplate() {
  return (
    <div>
      <Header />
      <div className="flex flex-row">
        <Sidebar />
        <main className="grow">
          <Outlet />
        </main>
      </div>
    </div>
  )
}