import fi from "../assets/fir.png";
import se from "../assets/sec.png";
import th from "../assets/third.png";
import fo from "../assets/fourth.png";

const Hero4 = () => {
  return (
    <div className="mt-10 bg-blue-50 py-6">
      <div className="container mx-auto">
        <div className="grid grid-rows-1 md:grid-cols-1 lg:grid-rows-4 gap-6">
          <div className="flex justify-center">
            <img src={fi} alt="First image" className="object-contain" />
          </div>
          <div className="flex justify-center">
            <img src={se} alt="Second image" className="object-contain" />
          </div>
          <div className="flex justify-center">
            <img src={th} alt="Third image" className="object-contain" />
          </div>
          <div className="flex justify-center">
            <img src={fo} alt="Fourth image" className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero4;