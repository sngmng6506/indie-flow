"""홍대플로우 흑백안 목업 보드를 만든다.

화면은 공연 목록, 공연 상세 두 장이고 출발 위치·걷는 시간 시트가 하나 있다.
반복되는 마크업을 한 곳에서 고치려고 생성 스크립트로 둔다.
보드 높이는 HEIGHTS에서 관리하고, 렌더링으로 넘침을 확인한 뒤 맞춘다.

사용: python3 design/tools/gen_bw.py [출력 폴더]   (기본 design/mockup)
"""
import pathlib, sys, urllib.parse

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'design/mockup')

INK, PAPER, SUB, CARD = '{{ink}}', '{{paper}}', '#4A4A4A', '#FAFAF8'
DISPLAY = "'Hahmlet', 'Noto Serif KR', serif"
DFONT = f'font-family: {DISPLAY}; font-weight: 700;'

HEIGHTS = {'ListBW': 1210, 'DetailBW': 830, 'SheetBW': 560}

noise_svg = ("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>"
             "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>"
             "<feColorMatrix type='saturate' values='0'/></filter>"
             "<rect width='100%' height='100%' filter='url(#n)'/></svg>")
NOISE = 'data:image/svg+xml,' + urllib.parse.quote(noise_svg, safe='')

HALFTONE = ('radial-gradient(circle, rgba(17,17,17,0.55) 0 1.1px, transparent 1.6px) 0 0 / 6px 6px, '
            'linear-gradient(160deg, #E2E2DE, #CACAC5)')

ARROW_L = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
EXTERNAL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>'
PIN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2"/></svg>'

TEXT_BTN = (f'min-height: 44px; padding: 0 2px; border: 0; background: transparent; color: {INK}; '
            f'font: inherit; font-size: 15px; text-decoration: underline; text-underline-offset: 3px')


def page(name, title, body, pad='0 20px 24px', bg=PAPER):
    h = HEIGHTS[name]
    head = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<title>' + title + '</title>\n'
            '<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@700&family=Noto+Sans+KR:wght@400;500;700&display=swap">\n'
            '<style>\nbody{margin:0}\na:focus-visible,button:focus-visible{outline:3px solid #111;outline-offset:2px}\nbutton{cursor:pointer}\n</style>\n'
            '</helmet>\n'
            f'<div style="position: relative; width: 390px; height: {h}px; box-sizing: border-box; background: {bg}; color: {INK}; '
            "font-family: 'Noto Sans KR', system-ui, sans-serif; font-size: 16px; line-height: 1.5; word-break: keep-all; "
            f'display: flex; flex-direction: column; padding: {pad}; overflow: hidden">\n'
            f'<div aria-hidden="true" style="position: absolute; inset: 0; pointer-events: none; opacity: 0.2; mix-blend-mode: multiply; '
            f'background-image: url(&quot;{NOISE}&quot;); background-size: 160px 160px"></div>\n')
    tail = ('</div>\n</x-dc>\n'
            '<script type="text/x-dc" data-dc-script data-props=\'{"ink":{"editor":"color","default":"#111111"},'
            '"paper":{"editor":"color","default":"#ECEBE7"},"$preview":{"width":390,"height":' + str(h) + '}}\'>\n'
            'class Component extends DCLogic {\nrenderVals() {\n'
            "return { ink: this.props.ink ?? '#111111', paper: this.props.paper ?? '#ECEBE7' };\n}\n}\n</script>\n</body>\n</html>\n")
    (OUT / f'{name}.dc.html').write_text(head + body + tail, encoding='utf-8')


def report_button():
    return (f'<button type="button" style="{TEXT_BTN}; font-size: 14px">정보가 다르면 알려주세요</button>')


def card(time, walk, title, venue, price, desc=None, soon=None, poster=False):
    """목록 카드. 화면에서 상자는 카드뿐이다. 한 줄 설명은 출처가 있을 때만 넣는다."""
    soon_html = (f'<span style="align-self: flex-start; margin-bottom: 6px; font-size: 14px; font-weight: 700; padding: 0 6px; '
                 f'white-space: nowrap; background: {INK}; color: #FFFFFF">{soon}</span>\n') if soon else ''
    desc_html = f'<p style="margin: 6px 0 0; font-size: 16px">{desc}</p>\n' if desc else ''
    poster_html = (f'<div aria-hidden="true" style="width: 72px; height: 100px; flex-shrink: 0; display: flex; align-items: flex-end; '
                   f'background: {HALFTONE}"><span style="margin: 0 0 6px 4px; padding: 0 4px; background: {CARD}; font-size: 14px">포스터</span></div>\n') if poster else ''
    return (f'<a href="DetailBW.dc.html" style="display: flex; gap: 12px; padding: 14px; margin-top: 14px; background: {CARD}; '
            f'border: 2px solid {INK}; color: {INK}; text-decoration: none">\n{poster_html}'
            f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column">\n{soon_html}'
            f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
            f'<span style="{DFONT} font-size: 26px; line-height: 1">{time}</span>\n'
            f'<span style="font-size: 14px; color: {SUB}; white-space: nowrap">도보 {walk}분</span>\n</div>\n'
            f'<h2 style="margin: 8px 0 0; font-size: 18px; font-weight: 700; line-height: 1.35; overflow-wrap: anywhere">{title}</h2>\n'
            f'<p style="margin: 2px 0 0; font-size: 14px; color: {SUB}">{venue}</p>\n{desc_html}'
            f'<p style="margin: 8px 0 0; font-size: 15px; font-weight: 700">{price}</p>\n</div>\n</a>\n')


def list_screen():
    days = [('오늘', 8, 6), ('월', 9, 2), ('화', 10, 1), ('수', 11, 3), ('목', 12, 4), ('금', 13, 9), ('토', 14, 11)]
    body = (f'<header style="padding: 24px 0 10px; border-bottom: 4px solid {INK}">\n'
            f'<div style="{DFONT} font-size: 28px; line-height: 1">홍대플로우</div>\n</header>\n')
    # 날짜 띠: 선택된 날만 검정 채움. 옆으로 밀면 2주 뒤까지 나온다.
    body += f'<div role="group" aria-label="날짜 고르기" style="display: flex; border-bottom: 2px solid {INK}">\n'
    for i, (wd, d, n) in enumerate(days):
        on = i == 0
        body += (f'<button type="button" aria-pressed="{"true" if on else "false"}" aria-label="11월 {d}일, 공연 {n}개" '
                 f'style="flex: 1; min-width: 0; min-height: 80px; padding: 8px 0; display: flex; flex-direction: column; align-items: center; '
                 f'gap: 3px; border: 0; background: {INK if on else "transparent"}; color: {"#FFFFFF" if on else INK}; font: inherit">\n'
                 f'<span style="font-size: 14px">{wd}</span>\n'
                 f'<span style="{DFONT} font-size: 22px; line-height: 1">{d}</span>\n'
                 f'<span style="font-size: 14px; color: {"#FFFFFF" if on else SUB}">{n}개</span>\n</button>\n')
    body += '</div>\n'
    body += (f'<section style="padding: 20px 0 0">\n'
             f'<h1 style="margin: 0; {DFONT} font-size: 32px; line-height: 1.2">오늘 걸어갈 수 있는<br>공연 '
             f'<span style="padding: 0 6px; background: {INK}; color: {PAPER}">4개</span></h1>\n'
             # 출발 위치와 걷는 시간: 거의 안 건드릴 설정이라 밑줄 글자 한 줄로만 둔다.
             f'<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0 12px; margin-top: 6px">\n'
             f'<button type="button" aria-haspopup="dialog" style="{TEXT_BTN}">홍대입구역에서 걸어서 15분 안 ▾</button>\n'
             f'<button type="button" style="{TEXT_BTN}; display: inline-flex; align-items: center; gap: 4px">{PIN}내 위치로</button>\n'
             f'</div>\n</section>\n')
    body += card('20:00', 4, '달빛정거장 단독공연', '작은방 라이브홀', '25,000원',
                 desc='기타 한 대로 부르는 잔잔한 노래', soon='20분 뒤 시작')
    body += card('20:30', 7, '사이다밴드 라이브', '서교 라이브클럽', '30,000원')
    body += card('21:00', 9, '초록우산 어쿠스틱 나잇', '연남 어쿠스틱룸', '15,000원',
                 desc='편안하게 듣는 기타 노래', poster=True)
    body += card('21:30', 11, '여름의 끝 정규 공연', '골목 라이브바', '20,000원', desc='소리가 크고 강한 록 밴드')
    body += (f'<button type="button" style="{TEXT_BTN}; align-self: center; min-height: 52px; margin-top: 10px; font-size: 16px; font-weight: 700">'
             f'더 먼 공연 2개도 보기</button>\n')
    body += (f'<footer style="margin-top: auto; padding-top: 8px; border-top: 2px solid {INK}">\n{report_button()}\n</footer>\n')
    page('ListBW', '홍대플로우 공연 목록', body)


def detail():
    section = f'margin-top: 20px; padding-top: 16px; border-top: 2px solid {INK}'
    label = f'margin: 0; font-size: 14px; font-weight: 700; color: {SUB}'
    body = (f'<a href="ListBW.dc.html" style="display: flex; align-items: center; gap: 6px; min-height: 56px; color: {INK}; '
            f'text-decoration: none; font-size: 16px; font-weight: 700; border-bottom: 4px solid {INK}">{ARROW_L}공연 목록으로</a>\n')
    body += (f'<section style="padding: 24px 0 0">\n'
             f'<p style="margin: 0; font-size: 14px; color: {SUB}">오늘 · 11월 8일 일요일</p>\n'
             f'<h1 style="margin: 6px 0 0; {DFONT} font-size: 32px; line-height: 1.18; overflow-wrap: anywhere">달빛정거장 단독공연</h1>\n'
             f'<p style="margin: 6px 0 0; font-size: 16px">작은방 라이브홀</p>\n</section>\n')
    fact = lambda k, v, sub: (f'<div style="flex: 1; padding: 14px 16px; background: {CARD}; border: 2px solid {INK}">\n'
                              f'<div style="font-size: 14px; font-weight: 700; color: {SUB}">{k}</div>\n'
                              f'<div style="margin-top: 4px; {DFONT} font-size: 24px; line-height: 1.1">{v}</div>\n'
                              f'<div style="margin-top: 4px; font-size: 14px; color: {SUB}">{sub}</div>\n</div>\n')
    body += ('<section style="margin-top: 20px; display: flex; gap: 12px">\n'
             + fact('시작 시간', '20:00', '19:30부터 입장') + fact('현장 가격', '25,000원', '예매 22,000원') + '</section>\n')
    body += (f'<section style="{section}">\n<h2 style="{label}">출연</h2>\n'
             f'<div style="margin-top: 4px; font-size: 18px; font-weight: 700">달빛정거장</div>\n'
             f'<p style="margin: 2px 0 0; font-size: 16px">기타와 목소리로 부르는 잔잔한 노래</p>\n'
             f'<a href="#" style="display: inline-flex; align-items: center; gap: 4px; min-height: 44px; color: {INK}; font-size: 16px; '
             f'font-weight: 700; text-underline-offset: 3px">유튜브에서 들어보기 {EXTERNAL}</a>\n</section>\n')
    body += (f'<section style="{section}">\n<h2 style="{label}">찾아가는 길</h2>\n'
             f'<div style="margin-top: 4px; font-size: 16px; font-weight: 700">작은방 라이브홀</div>\n'
             f'<p style="margin: 2px 0 0; font-size: 16px">[공연장 도로명 주소] 지하 1층</p>\n'
             f'<p style="margin: 2px 0 0; font-size: 14px; color: {SUB}">홍대입구역에서 도보 4분</p>\n</section>\n')
    body += (f'<section style="{section}; padding-top: 6px; font-size: 14px">\n'
             f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
             f'<span style="color: {SUB}">출처: 작은방 라이브홀 인스타그램</span>\n'
             f'<a href="#" style="display: inline-flex; align-items: center; gap: 4px; min-height: 44px; color: {INK}; font-weight: 700">원본 게시물 {EXTERNAL}</a>\n</div>\n'
             f'{report_button()}\n</section>\n')
    # 하단 고정 바: 실제 화면에서는 position: sticky; bottom: 0 으로 붙는다.
    body += (f'<div style="margin: auto -20px -24px; padding: 12px 20px 20px; background: {PAPER}; border-top: 2px solid {INK}; '
             f'display: flex; gap: 8px; position: relative">\n'
             f'<button type="button" style="flex: 1; min-height: 52px; border: 2px solid {INK}; background: {CARD}; color: {INK}; '
             f'font: inherit; font-size: 16px; font-weight: 700">길찾기</button>\n'
             f'<button type="button" style="flex: 1; min-height: 52px; border: 2px solid {INK}; background: {INK}; color: #FFFFFF; '
             f'font: inherit; font-size: 16px; font-weight: 700">예매하기</button>\n</div>\n')
    page('DetailBW', '달빛정거장 단독공연 상세', body)


def sheet():
    """출발 위치·걷는 시간 시트. 목록의 밑줄 글자를 누르면 아래에서 올라온다. 고르면 바로 적용된다."""
    def option(title, sub, on):
        mark = (f'<span aria-hidden="true" style="width: 20px; height: 20px; flex-shrink: 0; box-sizing: border-box; border: 2px solid {INK}; '
                f'border-radius: 50%; background: {"radial-gradient(circle, #111 0 5px, transparent 6px)" if on else "transparent"}"></span>')
        sub_html = f'<span style="display: block; font-size: 14px; color: {SUB}">{sub}</span>' if sub else ''
        return (f'<button type="button" role="radio" aria-checked="{"true" if on else "false"}" style="display: flex; align-items: center; gap: 12px; '
                f'width: 100%; min-height: 56px; padding: 6px 0; border: 0; border-top: 2px solid {INK}; background: transparent; color: {INK}; '
                f'font: inherit; font-size: 16px; font-weight: {700 if on else 500}; text-align: left">{mark}<span>{title}{sub_html}</span></button>\n')
    body = (f'<div style="flex: 1; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 16px; '
            f'color: #FFFFFF; font-size: 14px">목록 화면 위에 올라오는 시트</div>\n')
    body += (f'<div role="dialog" aria-label="출발 위치와 걷는 시간" style="position: relative; margin: 0 -20px -24px; padding: 20px 20px 24px; '
             f'background: {PAPER}; border-top: 4px solid {INK}">\n'
             f'<h2 style="margin: 0 0 10px; font-size: 18px; font-weight: 700">어디서 출발하나요?</h2>\n'
             f'<div role="radiogroup" aria-label="출발 위치">\n'
             + option('홍대입구역', None, True)
             + option('내 위치', '휴대폰이 위치를 써도 되는지 물어봐요', False)
             + '</div>\n'
             f'<h2 style="margin: 20px 0 10px; padding-top: 16px; border-top: 2px solid {INK}; font-size: 18px; font-weight: 700">얼마나 걸을 수 있나요?</h2>\n'
             f'<div role="radiogroup" aria-label="걷는 시간" style="display: flex; border: 2px solid {INK}">\n')
    for i, m in enumerate([10, 15, 20, 30]):
        on = m == 15
        body += (f'<button type="button" role="radio" aria-checked="{"true" if on else "false"}" style="flex: 1; min-height: 48px; border: 0; '
                 f'{"border-left: 2px solid " + INK + "; " if i else ""}background: {INK if on else CARD}; color: {"#FFFFFF" if on else INK}; '
                 f'font: inherit; font-size: 16px; font-weight: 700">{m}분</button>\n')
    body += ('</div>\n'
             f'<div style="display: flex; justify-content: space-between; margin-top: 14px">\n'
             f'<button type="button" style="{TEXT_BTN}">거리 상관없이 전체 보기</button>\n'
             f'<button type="button" style="{TEXT_BTN}; font-weight: 700">닫기</button>\n</div>\n</div>\n')
    page('SheetBW', '출발 위치와 걷는 시간', body, bg='#6F6F6C')


list_screen(); detail(); sheet()
print('ok')
