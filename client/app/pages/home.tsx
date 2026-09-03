import BetterDays from "~/components/home/better-days";
import Explanation from "~/components/home/explanation";
import Footer from "~/components/home/footer";
import HowItWorks from "~/components/home/how-it-works";
import Jumbotron from "~/components/home/jumbotron";
import HomepageHeader from "~/components/home/header";

// TODO:
// Login Page + connect tombol di jumbotron

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
            {/* <Explanation /> */}
            {/* <HowItWorks /> */}
            {/* <BetterDays /> */}
            {/* <Footer /> */}
        </div>
    )
}