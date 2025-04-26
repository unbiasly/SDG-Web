import React from 'react';
import { cn } from '@/lib/utils';
import { 
  signInWithGoogle, 
  signInWithApple, 
  signInWithFacebook, 
  signInWithTwitter 
} from '@/lib/utilities/firebase.config';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SOCIAL_AUTH_PROVIDERS } from '@/lib/constants/login-constants';

interface SocialSignInProps {
  className?: string;
}

const SocialSignIn: React.FC<SocialSignInProps> = ({ className }) => {
  const router = useRouter();

  const handleSocialSignIn = async (provider: 'google' | 'apple' | 'facebook' | 'twitter') => {
    try {
      let result;
      
      switch (provider) {
        case 'google':
          result = await signInWithGoogle();
          break;
        // case 'apple':
        //   result = await signInWithApple();
        //   break;
        // case 'facebook':
        //   result = await signInWithFacebook();
        //   break;
        // case 'twitter':
        //   result = await signInWithTwitter();
        //   break;
      }
      
      if (result) {
        // Get the Firebase ID token
        const idToken = await result.user.getIdToken();
        
        // Send the token to your backend
        const response = await fetch('/login/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: idToken,
            device_id: 'web',
            device_token: 'web',
          }),
        });
        
        const data = await response.json();
        
        if (data.jwtToken) {
          // Set cookies with the JWT token from your backend
          await fetch('/api/setCookieToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jwtToken: data.jwtToken,
                refreshToken: data.refreshToken,
                sessionId: data.sessionId,
                userId: data.userId,
            }),
            credentials: 'include'
          });
          
          console.log("Social login successful");
          router.push('/');
        } else {
          console.error("Social login failed:", data);
        }
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-center text-gray-600 mb-4">Continue with:</p>
      
      <div className="flex justify-center space-x-4">
        {SOCIAL_AUTH_PROVIDERS.map(({ provider, Icon }, index) => (
          <button
            key={index}
            aria-label={provider}
            onClick={() => handleSocialSignIn(provider as 'google' | 'apple' | 'facebook' | 'twitter')}
            className="social-button flex items-center justify-center w-18 h-10 rounded-lg border border-gray-200 bg-white p-5 cursor-pointer hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200 animate-fade-in transition-all"
          >
            <Image src={Icon} alt='Login Icon' width={100} height={100} className='object-contain w-fit h-fit'/>
          </button>
        ))}
      </div>
      {/* <div className="divider py-4 relative text-center">
        <span className="relative z-10 bg-white px-2 text-sm text-gray-700">or</span>
      </div> */}
    </div>
  );
};

export default SocialSignIn;
