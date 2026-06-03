import BetterDays from "~/components/home/better-days";
import Explanation from "~/components/home/explanation";
import Footer from "~/components/home/footer";
import HowItWorks from "~/components/home/how-it-works";
import Jumbotron from "~/components/home/jumbotron";

// TODO:
// Login Page + connect tombol di jumbotron

export function meta() {
  return [
    { title: "SleepWell" },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomePage() {
    return (
        <div className="bg-gray-800">
            <Jumbotron />
            <Explanation />
            <HowItWorks />
            <BetterDays />
            <Footer />
        </div>
    )
}