import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    // 정적 파일이나 내부 요청인 경우
    if (!isInternalOrStaticRequest(request)) {
        // 로그인이 필요한 페이지인 경우 인증 확인
        if (isRequireAuthentication(request)) {
            if (!(await isUserAuthenticated(request))) {
                return NextResponse.redirect(new URL(getHostUrl(request)));
            }
        }

        // 특정 경로에 대한 처리
        switch (request.nextUrl.pathname) {
            case "":
                return caseRootUrl(request);
            case "/":
                return caseRootUrl(request);
        }
    }
    return NextResponse.next();
}


function isInternalOrStaticRequest(request: NextRequest): boolean {
    const pathname = request.nextUrl.pathname;
    return pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');
}


function isAPIRequest(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith('/api');
}


function isRequireAuthentication(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith("/timetable");
}


function getHostUrl(request: NextRequest): string {
    return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

async function isUserAuthenticated(request: NextRequest): Promise<boolean> {
    const session = await getToken({ req: request, secret: process.env.ALZARTAK_NEXTAUTH_SECRET });
    return session !== null;
}

function isDeviceTypeMatchedWithPage(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);
    const isMobilePage = request.nextUrl.pathname.includes("mobile");
    return isMobile === isMobilePage;
}

function caseRootUrl(request: NextRequest): NextResponse {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = false; // /mobile/i.test(userAgent)를 사용하여 모바일 디바이스 여부를 판단
    const redirectUrl = isMobile
        ? `${getHostUrl(request)}/home/mobile`
        : `${getHostUrl(request)}/home/desktop`;
    return NextResponse.redirect(new URL(redirectUrl));
}