import { Outlet } from "@remix-run/react";
import { Group } from "dappkit";
import Footer from "src/components/layout/Footer";
import Header from "src/components/layout/Header";

export default function Index() {
  return (
    <Group size="xl" className="!gap-0 min-h-screen !flex-nowrap flex-col">
      <Header />
      <main className="flex-1 h-full">
        <Outlet />
      </main>
      <Footer />
    </Group>
  );
}
