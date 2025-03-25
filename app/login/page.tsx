import ImageSlider from '@/components/login/ImageSlider';
import SignInForm from '@/components/login/SignInForm';
import React from 'react'

const Page = () => {
    // const [isLoaded, setIsLoaded] = useState(false);
    
    // useEffect(() => {
    //   // Simulate loading of resources
    //   const timer = setTimeout(() => {
    //     setIsLoaded(true);
    //   }, 300);
      
    //   return () => clearTimeout(timer);
    // }, []);
  
    return (
      <div className="h-screen  px-20">
        <div className="flex flex-col lg:flex-row space-x-32 h-screen">
          {/* Left side - Image */}
          <div className="sign-in-image hidden mt-5 lg:block lg:w-1/2 bg-gray-900 relative animate-fade-in overflow-hidden">
            <ImageSlider/>
          </div>
          
          {/* Right side - Sign In Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center  animate-slide-in-right">
            <SignInForm />
          </div>
        </div>
        
        {/* Small screens caption */}
        {/* <div className="block lg:hidden px-6 py-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            SDG Stories: Global progress, daily updates. Stay informed
          </h2>
        </div> */}
      </div>
    );
  
    }
    

    
    

export default Page