import Header from './Header'
import Hero from './Hero'
import "tailwindcss"
import FindBySpecialisation from './Hero1'
import MedicalSpecialists from './Hero2'
import Hero4 from './Hero4'
export default function HomePage(){
    return(
        <div>
            <Header/>
            <Hero/>
            <FindBySpecialisation/>
            <MedicalSpecialists/>
            <Hero4/>
        </div>
    )
}