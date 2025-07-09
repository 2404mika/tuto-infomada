import React from "react";
import myImage from "../../assets/info.jpg"
 // Remplacez par le chemin correct de votre image

const About: React.FC = () => {
    return (
        <section data-aos="fade-up"
     data-aos-anchor-placement="bottom-center"
         className="min-h-[85vh] mt-16 rounded-2xl flex items-center flex-col bg-gradient-to-br from-blue-700 to-violet-600 text-white">
           
           <span className="bg-blue-700 p-2 mr-[15.9em] absolute rounded-tr-2xl z-[1]"></span>
           <span className="bg-slate-200 p-2 mr-[15.9em] absolute"></span>
           <span className="bg-blue-700 p-2 ml-[15.9em] absolute rounded-tl-2xl z-[1]"></span>
           <span className="bg-slate-200 p-2 ml-[15.9em] absolute"></span>
           <div className=" bg-slate-200 rounded-b-2xl">
           <h1 className="font-semibold text-2xl text-blue-950 pl-3 pr-3 pb-2">Qui sommes-nous ?</h1>
           
           </div>
            {/* <span className="bg-white h-0.5 w-80 mb-6"></span> */}
            <div className="relative w-full flex h-96 mt-10 p-5 gap-5 justify-center">
                <div className=" p-5 items-center rounded-3xl w-full">
                    <h1 className="text-center text-4xl"><i>INFOMADA</i></h1>
                    <div className=" mt-7 p-5"><p className="text-justify font-mono">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum atque itaque cum optio! Sapiente nobis saepe, nostrum quas ad velit reiciendis, molestiae commodi autem sit incidunt perspiciatis, soluta non quod.
                    Consectetur, suscipit quos qui sed, ipsa quibusdam aliquam dignissimos rem odio accusamus nemo et iusto magnam voluptate vero nam temporibus nesciunt? Nulla odio accusamus reiciendis laboriosam aperiam expedita, minus quam.
                    </p></div>
                </div>
                <div className=" rounded-lg w-full">
                <img 
                    src={myImage} 
                    alt="Description de l'image" 
                    className="object-cover h-full rounded-tl-[150px] rounded-br-[180px] rounded-bl-[60px] rounded-tr-[60px]"
                     // Ajoutez des classes pour le style
                />
                </div>
                
               
            </div>
        </section>
    );
};

export default About;