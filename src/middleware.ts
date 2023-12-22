import { NextRequest, NextResponse } from 'next/server';


/**
 * Next.js 미들웨어의 주 진입점입니다.
 * 요청된 URL에 따라 적절한 처리를 수행합니다.
 *
 * @param {NextRequest} request - 요청 객체, 요청에 대한 정보를 담고 있습니다.
 * @returns {NextResponse} - 요청에 대한 응답 객체를 반환합니다.
 */
export function middleware(request: NextRequest): NextResponse {
    switch (request.nextUrl.pathname) {
        case "/": return caseRootUrl(request);
        default: return caseDefault(request);
    }
}


/**
 * 현재 요청의 호스트 URL을 구성합니다.
 *
 * @param {NextRequest} request - 요청 객체, 현재 요청의 URL 정보를 담고 있습니다.
 * @returns {string} - 현재 요청의 호스트 URL을 문자열로 반환합니다.
 */
function getHostUrl(request: NextRequest): string {
    return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}


/**
 * 루트 URL('/')에 대한 요청을 처리하는 함수입니다.
 * 사용자의 장치 유형에 따라 적절한 페이지로 리다이렉트합니다.
 *
 * @param {NextRequest} request - 요청 객체, 사용자 에이전트 정보를 포함합니다.
 * @returns {NextResponse} - 리다이렉트에 대한 응답 객체를 반환합니다.
 */
function caseRootUrl(request: NextRequest): NextResponse {
    // 사용자의 device가 모바일인지 데스크톱인지 판별
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);

    // 리다이렉트 Url
    const redirectUrl = isMobile
        ? `${getHostUrl(request)}/home/mobile`
        : `${getHostUrl(request)}/home/desktop`;

    return NextResponse.redirect(new URL(redirectUrl));
}


/**
 * 기본 요청을 처리하는 함수입니다.
 * 사용자의 장치 유형(모바일 또는 데스크톱)과 현재 페이지의 유형을 비교하여
 * 불일치하는 경우 적절한 페이지로 리다이렉트합니다.
 *
 * @param {NextRequest} request - 요청 객체, 사용자 에이전트와 URL 정보를 포함합니다.
 * @returns {NextResponse} - 적절한 응답 객체를 반환합니다.
 *                           장치 유형과 페이지 유형이 불일치하는 경우, 홈 URL로 리다이렉트합니다.
 */
function caseDefault(request: NextRequest): NextResponse {
    // 사용자의 device가 모바일인지 데스크톱인지 판별
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);

    // 현재 URL이 모바일 페이지를 가리키는지 확인
    const isMobilePage = request.nextUrl.pathname.includes("mobile");

    // 장치 유형과 페이지 유형이 일치하지 않는 경우, 홈 URL로 리다이렉트
    if (isMobilePage !== isMobile) {
        return NextResponse.redirect(new URL(getHostUrl(request)));
    }

    // 일치하는 경우, 요청을 계속 진행
    return NextResponse.next();
}