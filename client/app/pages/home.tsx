import BetterDays from "~/components/home/better-days";
import Explanation from "~/components/home/explanation";
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

export default function Home() {
    return (
        <div className="bg-gray-800">
            <Jumbotron />
            <Explanation />
            <HowItWorks />
            <BetterDays />
        </div>
    )
}