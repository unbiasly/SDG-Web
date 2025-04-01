import { ManualAuthRequest, SocialAuthRequest } from '@/service/api.interface';
import BackAPI from '@/service/app.api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const isSocialLogin = body.token !== undefined; // Social login has a token field
        
        let data;
        if (isSocialLogin) {
            data = await BackAPI.postSocialLogin(body as SocialAuthRequest);
        } else {
            data = await BackAPI.postManualLogin(body as ManualAuthRequest);
        }
        
        return Response.json(data);
    } catch (error) {
        console.error('Login error:', error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error',
            },
            { status: 500 }
        );
    }
}


