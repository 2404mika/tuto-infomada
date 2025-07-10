import About from "../landing/About";
import FormationCard from "../landing/FormationCard";
import Header from "../landing/Header";
import HeroSection from "../landing/HeroSection";
import Contact from "../landing/Contact";

const LandingPage: React.FC = () => {
    return (
        <div className="bg-slate-200 flex flex-col justify-start items-center">
            <div className="bg-transparent mt-2 w-full rounded-lg fixed pl-6 pr-6 z-50">
                <Header />
            </div>
          
            <main className="pt-[1px] w-full">
                <section className="p-4">
                    <HeroSection />
                    <FormationCard />
                    <About />
                    <Contact/>
                </section>
            </main>
            
            
        </div>
    )
}
export  default LandingPage