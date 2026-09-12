import BetterDays from "~/components/home/better-days";

import Footer from "~/components/home/footer";
import HowItWorks from "~/components/home/how-it-works";
import Jumbotron from "~/components/home/jumbotron";
import HomepageHeader from "~/components/home/header";
import SleepCharts from "~/components/home/sq-histogram";
import UnderstandSection from "~/components/home/understand";


export function meta() {
  return [
    { title: "NightTrack" },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomePage() {
    return (
        <div className="    ">
            <HomepageHeader />
            <Jumbotron />
            <UnderstandSection />
            <HowItWorks />
            <SleepCharts />
            <BetterDays />
            <Footer />
        </div>
    )
}