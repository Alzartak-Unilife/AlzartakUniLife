import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * HTTP 요청에 대한 처리
 * @param {NextRequest} request - 들어오는 요청 정보
 * @returns {NextResponse} 요청에 따른 응답을 반환
 */
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
            case "/":
                return caseRootUrl(request);
        }
    }
    return NextResponse.next();
}

/**
 * 요청이 정적 파일이나 내부 요청인지 판단
 * @param {NextRequest} request - 요청 객체
 * @returns {boolean} 정적 파일이나 내부 요청인 경우 true를 반환
 */
function isInternalOrStaticRequest(request: NextRequest): boolean {
    const pathname = request.nextUrl.pathname;
    return pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');
}

/**
 * 요청이 API 요청인지 판단
 * @param {NextRequest} request - 요청 객체
 * @returns {boolean} API 요청인 경우 true를 반환
 */
function isAPIRequest(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith('/api');
}

/**
 * 요청된 페이지가 인증을 필요로 하는지 판별
 * @param {NextRequest} request - 요청 객체
 * @returns {boolean} 인증이 필요한 페이지인 경우 true를 반환
 */
function isRequireAuthentication(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith("/timetable");
}

/**
 * 요청의 호스트 URL을 반환합니다.
 * @param {NextRequest} request - 요청 객체입니다.
 * @returns {string} 요청의 호스트 URL을 문자열로 반환
 */
function getHostUrl(request: NextRequest): string {
    return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

/**
 * 요청에 포함된 사용자가 인증되었는지 여부를 확인
 * @param {NextRequest} request - 요청 객체
 * @returns {Promise<boolean>} 인증된 사용자인 경우 true를 반환
 */
async function isUserAuthenticated(request: NextRequest): Promise<boolean> {
    const session = await getToken({ req: request, secret: process.env.ALZARTAK_NEXTAUTH_SECRET });
    return session !== null;
}

/**
 * 요청된 페이지와 사용자의 디바이스 타입이 일치하는지 판별 
 * @param {NextRequest} request - 요청 객체
 * @returns {boolean} 디바이스 타입과 페이지 타입이 일치하면 true를 반환
 */
function isDeviceTypeMatchedWithPage(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);
    const isMobilePage = request.nextUrl.pathname.includes("mobile");
    return isMobile === isMobilePage;
}

/**
 * 루트 URL('/')에 대한 요청을 처리
 * @param {NextRequest} request - 요청 객체
 * @returns {NextResponse} 사용자의 디바이스에 맞는 페이지로 리다이렉트
 */
function caseRootUrl(request: NextRequest): NextResponse {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = false; // /mobile/i.test(userAgent)를 사용하여 모바일 디바이스 여부를 판단
    const redirectUrl = isMobile
        ? `${getHostUrl(request)}/home/mobile`
        : `${getHostUrl(request)}/home/desktop`;
    return NextResponse.redirect(new URL(redirectUrl));
}