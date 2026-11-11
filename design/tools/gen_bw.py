"""홍대플로우 흑백안 목업 보드를 만든다.

반복되는 카드·탭·머리말 마크업을 한 곳에서 고치려고 생성 스크립트로 둔다.
보드 높이는 HEIGHTS에서 관리하고, 렌더링으로 넘침을 확인한 뒤 맞춘다.
"""
import pathlib, sys, urllib.parse

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else
                   'design/mockup')

INK, PAPER, SUB, CARD = '{{ink}}', '{{paper}}', '#4A4A4A', '#FAFAF8'
DISPLAY = "'Hahmlet', 'Noto Serif KR', serif"
DFONT = f'font-family: {DISPLAY}; font-weight: 700;'

HEIGHTS = {
    'MainBW': 1610, 'DetailBW': 1180, 'CalendarBW': 1100,
    'NoLocBW': 1080, 'EmptyBW': 700, 'StatesBW': 840,
}

noise_svg = ("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>"
             "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>"
             "<feColorMatrix type='saturate' values='0'/></filter>"
             "<rect width='100%' height='100%' filter='url(#n)'/></svg>")
NOISE = 'data:image/svg+xml,' + urllib.parse.quote(noise_svg, safe='')

# 망점은 실제 내용처럼 보이지 않게 옅게 둔다.
HALFTONE = ('radial-gradient(circle, rgba(17,17,17,0.55) 0 1.1px, transparent 1.6px) 0 0 / 6px 6px, '
            'linear-gradient(160deg, #E2E2DE, #CACAC5)')

PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>'
ARROW_R = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
ARROW_L = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
EXTERNAL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>'


def page(name, title, body):
    h = HEIGHTS[name]
    head = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<title>' + title + '</title>\n'
            '<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@700&family=Noto+Sans+KR:wght@400;500;700&display=swap">\n'
            '<style>\nbody{margin:0}\na:focus-visible,button:focus-visible{outline:3px solid #111;outline-offset:2px}\nbutton{cursor:pointer}\n</style>\n'
            '</helmet>\n'
            f'<div style="position: relative; width: 390px; height: {h}px; box-sizing: border-box; background: {PAPER}; color: {INK}; '
            "font-family: 'Noto Sans KR', system-ui, sans-serif; font-size: 16px; line-height: 1.5; word-break: keep-all; "
            'display: flex; flex-direction: column; padding: 0 20px 24px; overflow: hidden">\n'
            f'<div aria-hidden="true" style="position: absolute; inset: 0; pointer-events: none; opacity: 0.2; mix-blend-mode: multiply; '
            f'background-image: url(&quot;{NOISE}&quot;); background-size: 160px 160px"></div>\n')
    tail = ('</div>\n</x-dc>\n'
            '<script type="text/x-dc" data-dc-script data-props=\'{"ink":{"editor":"color","default":"#111111"},'
            '"paper":{"editor":"color","default":"#ECEBE7"},"$preview":{"width":390,"height":' + str(h) + '}}\'>\n'
            'class Component extends DCLogic {\nrenderVals() {\n'
            "return { ink: this.props.ink ?? '#111111', paper: this.props.paper ?? '#ECEBE7' };\n}\n}\n</script>\n</body>\n</html>\n")
    (OUT / f'{name}.dc.html').write_text(head + body + tail, encoding='utf-8')


# ---------- 공통 조각 ----------

def header():
    return (f'<header style="display: flex; align-items: flex-end; justify-content: space-between; padding: 24px 0 10px; border-bottom: 4px solid {INK}">\n'
            f'<div style="{DFONT} font-size: 28px; line-height: 1">홍대플로우</div>\n'
            f'<div style="font-size: 14px; font-weight: 700">오늘 홍대 공연</div>\n</header>\n')


def tabs(active):
    """지금 근처 / 공연 달력. 화면 이동이라 링크 + aria-current로 둔다."""
    items = [('near', '지금 근처', 'MainBW.dc.html'), ('cal', '공연 달력', 'CalendarBW.dc.html')]
    out = '<nav aria-label="보기 바꾸기" style="display: flex; margin-top: 16px">\n'
    for i, (key, label, href) in enumerate(items):
        on = key == active
        style = (f'flex: 1; display: flex; align-items: center; justify-content: center; min-height: 48px; '
                 f'border: 2px solid {INK}; {"border-left: 0; " if i else ""}text-decoration: none; font-size: 16px; font-weight: 700; '
                 + (f'background: {INK}; color: #FFFFFF' if on else f'background: {CARD}; color: {INK}'))
        cur = ' aria-current="page"' if on else ''
        out += f'<a href="{href}"{cur} style="{style}">{label}</a>\n'
    return out + '</nav>\n'


def chips(labels, selected=0, label='공연 시간 고르기'):
    out = f'<div role="group" aria-label="{label}" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 0 2px">\n'
    for i, t in enumerate(labels):
        on = i == selected
        out += (f'<button type="button" aria-pressed="{"true" if on else "false"}" style="min-height: 44px; padding: 0 14px; '
                f'border: 2px solid {INK}; background: {INK if on else "transparent"}; color: {"#FFFFFF" if on else INK}; '
                f'font: inherit; font-size: 16px; font-weight: {700 if on else 500}">{t}</button>\n')
    return out + '</div>\n'


def tape(left, rot):
    return (f'<div aria-hidden="true" style="position: absolute; top: -9px; left: {left}px; width: 52px; height: 18px; '
            f'background: rgba(255,255,255,0.75); box-shadow: 0 0 0 1px rgba(0,0,0,0.22); transform: rotate({rot}deg)"></div>')


def stamp(text, rot=-3):
    return (f'<span style="display: inline-block; font-size: 14px; font-weight: 700; padding: 1px 8px; white-space: nowrap; '
            f'border: 2px solid {INK}; transform: rotate({rot}deg)">{text}</span>')


def play_button(extra=''):
    # 검정 채움을 줄이려고 흰 바탕 + 테두리로 둔다.
    return (f'<button type="button" aria-label="미리 듣기" style="{extra}width: 44px; height: 44px; padding: 0; display: flex; '
            f'align-items: center; justify-content: center; border: 2px solid {INK}; background: {CARD}; color: {INK}">{PLAY}</button>')


def tag(text, filled=True):
    style = (f'background: {INK}; color: #FFFFFF; border: 2px solid {INK}' if filled
             else f'background: {CARD}; color: {INK}; border: 2px solid {INK}')
    return (f'<span style="align-self: flex-start; margin-bottom: 6px; font-size: 14px; font-weight: 700; padding: 0 6px; '
            f'white-space: nowrap; {style}">{text}</span>\n')


def card(time, where, title, venue, desc, price, poster=False, first=False, tag_html='', tape_rot=-4,
         price_html=None, extra_stamp=None):
    badges = ''
    if extra_stamp:
        badges += stamp(extra_stamp, -2)
    if first:
        badges += stamp('처음 가기 좋음')
    price_html = price_html or f'<span style="font-size: 15px; font-weight: 700; white-space: nowrap">{price}</span>'
    text = (f'<a href="DetailBW.dc.html" style="flex: 1; min-width: 0; display: flex; flex-direction: column; color: {INK}; text-decoration: none">\n'
            f'{tag_html}<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
            f'<span style="{DFONT} font-size: 26px; line-height: 1">{time}</span>\n'
            f'<span style="font-size: 14px; color: {SUB}; white-space: nowrap">{where}</span>\n</div>\n'
            f'<h2 style="margin: 8px 0 0; font-size: 18px; font-weight: 700; line-height: 1.35; overflow-wrap: anywhere">{title}</h2>\n'
            f'<p style="margin: 2px 0 0; font-size: 14px; color: {SUB}">{venue}</p>\n'
            f'<p style="margin: 6px 0 0; font-size: 16px">{desc}</p>\n'
            f'<div style="margin-top: auto; padding-top: 10px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px">\n'
            f'{badges}{price_html}\n</div>\n</a>')
    art = (f'<article style="position: relative; display: flex; gap: 12px; padding: 12px; margin-top: 18px; '
           f'background: {CARD}; border: 2px solid {INK}">\n')
    if poster:
        art += (f'<div style="position: relative; width: 104px; height: 144px; flex-shrink: 0">\n'
                f'<a href="DetailBW.dc.html" tabindex="-1" aria-hidden="true" style="display: flex; align-items: flex-end; width: 104px; height: 144px; '
                f'background: {HALFTONE}; text-decoration: none"><span style="margin: 0 0 8px 6px; padding: 0 4px; background: {CARD}; color: {INK}; font-size: 14px">포스터</span></a>\n'
                f'{tape(26, tape_rot)}\n{play_button("position: absolute; right: 6px; bottom: 6px; ")}\n</div>\n{text}\n')
    else:
        art += f'{text}\n{play_button("align-self: flex-end; flex-shrink: 0; ")}\n'
    return art + '</article>\n'


def outline_button(label, href=None, icon=ARROW_R, margin='24px'):
    style = (f'display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; min-height: 56px; '
             f'margin-top: {margin}; padding: 0 16px; border: 2px solid {INK}; background: {CARD}; color: {INK}; '
             f'font: inherit; font-size: 16px; font-weight: 700; text-align: left; text-decoration: none')
    inner = f'<span>{label}</span>\n{icon}'
    if href:
        return f'<a href="{href}" style="{style}">\n{inner}\n</a>\n'
    return f'<button type="button" style="{style}">\n{inner}\n</button>\n'


def survey():
    btns = ''.join(f'<button type="button" aria-pressed="false" style="flex: 1; min-height: 48px; border: 2px solid {INK}; '
                   f'background: {CARD}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">{t}</button>\n'
                   for t in ['처음이에요', '가끔 가요', '자주 가요'])
    return (f'<section style="margin-top: 20px; padding: 16px; border: 2px dashed {INK}">\n'
            f'<h2 style="margin: 0; font-size: 17px; font-weight: 700">인디 공연, 가본 적 있나요?</h2>\n'
            f'<p style="margin: 2px 0 0; font-size: 14px; color: {SUB}">한 번 누르면 끝이에요.</p>\n'
            f'<div role="group" aria-label="인디 공연 경험" style="display: flex; gap: 8px; margin-top: 12px">\n{btns}</div>\n</section>\n')


def footer(checked='19:40'):
    return (f'<footer style="margin-top: auto; padding-top: 12px; border-top: 2px solid {INK}; display: flex; '
            f'justify-content: space-between; align-items: center; font-size: 14px">\n'
            f'<span>마지막 확인 {checked}</span>\n'
            f'<button type="button" style="min-height: 44px; padding: 0 4px; border: 0; background: transparent; color: {INK}; '
            f'font: inherit; font-size: 14px; text-decoration: underline">정보가 다르면 알려주세요</button>\n</footer>\n')


def hero(meta, html):
    return (f'<section style="padding: 20px 0 0">\n<p style="margin: 0; font-size: 14px; color: {SUB}">{meta}</p>\n'
            f'<h1 style="margin: 6px 0 0; {DFONT} font-size: 34px; line-height: 1.18">{html}</h1>\n</section>\n')


def count_box(n):
    return f'<span style="padding: 0 6px; background: {INK}; color: {PAPER}">{n}</span>'


# ---------- 화면 ----------

def main():
    body = header() + tabs('near')
    # 걷는 거리 설정: 거의 안 건드릴 값이라 보조 글자 줄에 밑줄 글자로만 둔다. 누르면 10·15·20·30분 선택.
    walk = (f'<button type="button" aria-haspopup="listbox" aria-label="걸어서 가는 거리 바꾸기, 지금 15분" '
            f'style="min-height: 44px; padding: 0 2px; border: 0; background: transparent; color: {SUB}; font: inherit; '
            f'font-size: 14px; text-decoration: underline">걸어서 15분 안 ▾</button>')
    body += hero(f'저녁 8시 기준 · {walk}', f'지금 걸어서<br>갈 수 있는 공연 {count_box("4개")}')
    body += chips(['지금 갈 수 있는', '오늘 밤'])
    body += card('20:00', '도보 4분', '달빛정거장 단독공연', '작은방 라이브홀', '기타 한 대로 부르는 잔잔한 노래', '25,000원',
                 poster=True, first=True, tag_html=tag('20분 뒤 시작'), tape_rot=-5)
    body += card('20:30', '도보 7분', '사이다밴드 라이브', '서교 라이브클럽', '신나게 뛰어노는 밴드 음악', '30,000원')
    body += card('21:00', '도보 9분', '초록우산 어쿠스틱 나잇', '연남 어쿠스틱룸', '편안하게 듣는 기타 노래', '15,000원',
                 poster=True, first=True, tape_rot=4)
    body += card('21:30', '도보 11분', '여름의 끝 정규 공연', '골목 라이브바', '소리가 크고 강한 록 밴드', '20,000원')
    body += outline_button('다른 날 공연은 공연 달력에서', href='CalendarBW.dc.html')
    body += outline_button('인디 공연이 처음이세요? 안내 보기', margin='12px')
    body += survey() + footer()
    page('MainBW', '홍대플로우 지금 근처 공연', body)


def info_box(label, inner, margin=16):
    return (f'<section style="margin-top: {margin}px; padding: 16px; background: {CARD}; border: 2px solid {INK}">\n'
            f'<h2 style="margin: 0; font-size: 14px; font-weight: 700; color: {SUB}">{label}</h2>\n{inner}</section>\n')


def detail():
    body = (f'<a href="MainBW.dc.html" style="display: flex; align-items: center; gap: 6px; min-height: 56px; color: {INK}; '
            f'text-decoration: none; font-size: 16px; font-weight: 700; border-bottom: 4px solid {INK}">{ARROW_L}오늘 공연으로</a>\n')
    body += (f'<section style="display: flex; gap: 16px; padding: 24px 0 0">\n'
             f'<div style="position: relative; width: 120px; height: 168px; flex-shrink: 0">\n'
             f'<div role="img" aria-label="공연 포스터 자리" style="display: flex; align-items: flex-end; width: 120px; height: 168px; '
             f'background: {HALFTONE}; border: 2px solid {INK}; box-sizing: border-box"><span style="margin: 0 0 8px 6px; padding: 0 4px; '
             f'background: {CARD}; font-size: 14px">포스터</span></div>\n{tape(34, -4)}\n</div>\n'
             f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column">\n'
             f'<p style="margin: 0; font-size: 14px; color: {SUB}">오늘 · 11월 8일 일요일</p>\n'
             f'<h1 style="margin: 6px 0 0; {DFONT} font-size: 30px; line-height: 1.15; overflow-wrap: anywhere">달빛정거장 단독공연</h1>\n'
             f'<p style="margin: 6px 0 0; font-size: 16px">작은방 라이브홀</p>\n'
             f'<div style="margin-top: auto; padding-top: 12px">{stamp("처음 가기 좋음")}</div>\n</div>\n</section>\n')
    fact = lambda label, value, sub: (f'<div style="flex: 1; padding: 14px 16px; background: {CARD}; border: 2px solid {INK}">\n'
                                      f'<div style="font-size: 14px; font-weight: 700; color: {SUB}">{label}</div>\n'
                                      f'<div style="margin-top: 4px; {DFONT} font-size: 24px; line-height: 1.1">{value}</div>\n'
                                      f'<div style="margin-top: 4px; font-size: 14px; color: {SUB}">{sub}</div>\n</div>\n')
    body += (f'<section style="margin-top: 24px; display: flex; gap: 12px">\n'
             + fact('시작 시간', '20:00', '19:30부터 입장') + fact('현장 가격', '25,000원', '예매 22,000원') + '</section>\n')
    body += info_box('출연', f'<div style="margin-top: 4px; font-size: 18px; font-weight: 700">달빛정거장</div>\n'
                     f'<p style="margin: 2px 0 0; font-size: 16px">기타와 목소리로 부르는 잔잔한 노래</p>\n'
                     f'<button type="button" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; '
                     f'min-height: 48px; margin-top: 12px; border: 2px solid {INK}; background: transparent; color: {INK}; font: inherit; '
                     f'font-size: 16px; font-weight: 700">{PLAY}미리 듣기</button>\n')
    body += info_box('찾아가는 길', f'<div style="margin-top: 4px; font-size: 16px; font-weight: 700">작은방 라이브홀</div>\n'
                     f'<p style="margin: 2px 0 0; font-size: 16px">[공연장 도로명 주소] 지하 1층</p>\n'
                     f'<p style="margin: 2px 0 0; font-size: 14px; color: {SUB}">여기서 도보 4분</p>\n')
    nxt = lambda date, time, title: (f'<a href="DetailBW.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 52px; '
                                     f'border-top: 2px solid {INK}; color: {INK}; text-decoration: none">\n'
                                     f'<span style="width: 92px; flex-shrink: 0; font-size: 14px; color: {SUB}">{date}</span>\n'
                                     f'<span style="{DFONT} font-size: 18px">{time}</span>\n'
                                     f'<span style="flex: 1; min-width: 0; font-size: 16px; font-weight: 700">{title}</span>\n</a>\n')
    body += info_box('이 공연장의 다음 공연', '<div style="margin-top: 8px">\n'
                     + nxt('11월 12일 목', '20:00', '새벽빛 밴드') + nxt('11월 14일 토', '19:30', '작은방 정기 공연')
                     + f'</div>\n<a href="#" style="display: flex; align-items: center; min-height: 44px; border-top: 2px solid {INK}; '
                       f'color: {INK}; font-size: 14px; font-weight: 700">공연장 페이지 보기</a>\n')
    body += (f'<section style="margin-top: 16px; display: flex; flex-direction: column; gap: 2px; font-size: 14px">\n'
             f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
             f'<span style="color: {SUB}">출처: 작은방 라이브홀 인스타그램</span>\n'
             f'<a href="#" style="display: inline-flex; align-items: center; gap: 4px; min-height: 44px; color: {INK}; font-weight: 700">원본 게시물 {EXTERNAL}</a>\n</div>\n'
             f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
             f'<span style="color: {SUB}">마지막 확인 19:40</span>\n'
             f'<button type="button" style="min-height: 44px; padding: 0 4px; border: 0; background: transparent; color: {INK}; font: inherit; '
             f'font-size: 14px; text-decoration: underline">정보가 다르면 알려주세요</button>\n</div>\n</section>\n')
    # 하단 고정 바: 실제 화면에서는 position: sticky; bottom: 0 으로 붙는다.
    body += (f'<div style="margin: auto -20px -24px; padding: 12px 20px 20px; background: {PAPER}; border-top: 2px solid {INK}; '
             f'display: flex; gap: 8px; position: relative">\n'
             f'<button type="button" style="flex: 1; min-height: 52px; border: 2px solid {INK}; background: {CARD}; color: {INK}; '
             f'font: inherit; font-size: 16px; font-weight: 700">길찾기</button>\n'
             f'<button type="button" style="flex: 1; min-height: 52px; border: 2px solid {INK}; background: {INK}; color: #FFFFFF; '
             f'font: inherit; font-size: 16px; font-weight: 700">예매하기</button>\n</div>\n')
    page('DetailBW', '달빛정거장 단독공연 상세', body)


def calendar():
    days = [('일', 8, 6), ('월', 9, 2), ('화', 10, 1), ('수', 11, 3), ('목', 12, 4), ('금', 13, 9), ('토', 14, 11)]
    body = header() + tabs('cal')
    sq = (f'width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; '
          f'border: 2px solid {INK}; background: {CARD}; color: {INK}')
    body += (f'<div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0 0">\n'
             f'<h1 style="margin: 0; {DFONT} font-size: 30px; line-height: 1">11월</h1>\n'
             f'<div style="display: flex; gap: 8px">\n'
             f'<button type="button" style="min-height: 44px; padding: 0 12px; border: 2px solid {INK}; background: {CARD}; color: {INK}; '
             f'font: inherit; font-size: 14px; font-weight: 700">오늘</button>\n'
             f'<button type="button" aria-label="이전 주" style="{sq}">{ARROW_L}</button>\n'
             f'<button type="button" aria-label="다음 주" style="{sq}">{ARROW_R}</button>\n</div>\n</div>\n')
    body += '<div role="group" aria-label="날짜 고르기" style="display: flex; gap: 4px; margin-top: 14px">\n'
    for i, (wd, d, n) in enumerate(days):
        on = i == 0
        color = '#FFFFFF' if on else INK
        sub = '#FFFFFF' if on else SUB
        body += (f'<button type="button" aria-pressed="{"true" if on else "false"}" aria-label="11월 {d}일 {wd}요일, 공연 {n}개" '
                 f'style="flex: 1; min-width: 0; min-height: 76px; padding: 6px 0; display: flex; flex-direction: column; align-items: center; '
                 f'gap: 2px; border: 2px solid {INK}; background: {INK if on else CARD}; color: {color}; font: inherit">\n'
                 f'<span style="font-size: 14px; color: {sub}">{"오늘" if on else wd}</span>\n'
                 f'<span style="{DFONT} font-size: 22px; line-height: 1">{d}</span>\n'
                 f'<span style="font-size: 14px; font-weight: 700; color: {sub}">{n}</span>\n</button>\n')
    body += '</div>\n'
    body += (f'<p style="margin: 6px 0 0; font-size: 14px; color: {SUB}">날짜 아래 숫자는 그날 공연 수예요.</p>\n')
    body += chips(['전체', '처음 가기 좋은 공연만'], 0, '공연 고르기')
    body += (f'<h2 style="margin: 18px 0 0; font-size: 18px; font-weight: 700">11월 8일 일요일 · 공연 6개</h2>\n'
             f'<div style="margin-top: 10px; background: {CARD}; border: 2px solid {INK}">\n')
    rows = [('18:00', '오후의 포크', '합정 작은무대', '15,000원', False, True),
            ('20:00', '달빛정거장 단독공연', '작은방 라이브홀', '25,000원', True, False),
            ('20:30', '사이다밴드 라이브', '서교 라이브클럽', '30,000원', False, False),
            ('21:00', '초록우산 어쿠스틱 나잇', '연남 어쿠스틱룸', '15,000원', True, False),
            ('21:30', '여름의 끝 정규 공연', '골목 라이브바', '20,000원', False, False),
            ('22:30', '심야 즉흥 잼', '상수 지하실', '10,000원', False, False)]
    for i, (t, title, venue, price, first, ended) in enumerate(rows):
        top = f'border-top: 2px solid {INK}; ' if i else ''
        tcolor = SUB if ended else INK
        meta = venue + ('<span style="display: block; margin-top: 4px">' + stamp('처음 가기 좋음', 0) + '</span>' if first else '')
        right = (f'<span style="font-size: 14px; font-weight: 700; padding: 0 6px; border: 2px solid {SUB}; color: {SUB}; white-space: nowrap">끝남</span>'
                 if ended else f'<span style="font-size: 15px; font-weight: 700; white-space: nowrap">{price}</span>')
        body += (f'<a href="DetailBW.dc.html" style="{top}display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 10px 12px; '
                 f'color: {tcolor}; text-decoration: none">\n'
                 f'<span style="width: 58px; flex-shrink: 0; {DFONT} font-size: 20px; line-height: 1">{t}</span>\n'
                 f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px">\n'
                 f'<span style="font-size: 16px; font-weight: 700; overflow-wrap: anywhere">{title}</span>\n'
                 f'<span style="font-size: 14px; color: {SUB}">{meta}</span>\n</span>\n{right}\n</a>\n')
    body += '</div>\n' + footer()
    page('CalendarBW', '홍대플로우 공연 달력', body)


def no_location():
    body = header() + tabs('near')
    body += hero('11월 8일 일요일 · 저녁 8시 기준', f'오늘 홍대 공연 {count_box("12개")}')
    body += chips(['지금 갈 수 있는', '오늘 밤'], 1)
    body += outline_button('내 위치에서 걸어서 몇 분인지 보기', icon=ARROW_R, margin='14px')
    body += card('20:00', '서교동', '달빛정거장 단독공연', '작은방 라이브홀', '기타 한 대로 부르는 잔잔한 노래', '25,000원',
                 poster=True, first=True, tape_rot=-5)
    body += card('20:30', '서교동', '사이다밴드 라이브', '서교 라이브클럽', '신나게 뛰어노는 밴드 음악', '30,000원')
    body += card('21:00', '연남동', '초록우산 어쿠스틱 나잇', '연남 어쿠스틱룸', '편안하게 듣는 기타 노래', '15,000원',
                 poster=True, first=True, tape_rot=4)
    body += footer()
    page('NoLocBW', '홍대플로우 위치 모를 때', body)


def empty():
    body = header() + tabs('near')
    body += hero('11월 9일 월요일 · 밤 11시 40분 기준', '지금 걸어서 갈 수 있는<br>공연이 없어요')
    body += (f'<section style="position: relative; margin-top: 28px; padding: 28px 20px; background: {CARD}; border: 2px dashed {INK}; text-align: center">\n'
             f'{tape(150, -3)}\n'
             f'<div style="{DFONT} font-size: 30px; line-height: 1.2">오늘 공연 끝</div>\n'
             f'<p style="margin: 10px 0 0; font-size: 16px">월요일 밤은 공연이 적어요.<br>내일은 공연이 3개 있어요.</p>\n</section>\n')
    body += (f'<a href="CalendarBW.dc.html" style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; '
             f'margin-top: 24px; padding: 0 16px; border: 2px solid {INK}; background: {INK}; color: #FFFFFF; font-size: 16px; '
             f'font-weight: 700; text-decoration: none"><span>내일 공연 3개 보기</span>{ARROW_R}</a>\n')
    body += outline_button('공연 달력 열기', href='CalendarBW.dc.html', margin='12px')
    body += footer('23:30')
    page('EmptyBW', '홍대플로우 공연 없을 때', body)


def states():
    body = (f'<header style="padding: 24px 0 10px; border-bottom: 4px solid {INK}">\n'
            f'<div style="{DFONT} font-size: 26px; line-height: 1.1">카드 상태</div>\n'
            f'<p style="margin: 6px 0 0; font-size: 14px; color: {SUB}">매진, 현장 판매만, 이미 시작한 공연은 이렇게 보여줍니다.</p>\n</header>\n')
    body += card('20:30', '도보 7분', '사이다밴드 라이브', '서교 라이브클럽', '신나게 뛰어노는 밴드 음악', '',
                 extra_stamp='매진',
                 price_html=f'<span style="font-size: 15px; color: {SUB}; text-decoration: line-through">30,000원</span>')
    body += card('21:30', '도보 11분', '여름의 끝 정규 공연', '골목 라이브바', '소리가 크고 강한 록 밴드', '',
                 price_html='<span style="font-size: 15px; font-weight: 700">20,000원 · 현장에서만 팔아요</span>')
    body += card('20:00', '도보 4분', '달빛정거장 단독공연', '작은방 라이브홀', '기타 한 대로 부르는 잔잔한 노래', '25,000원',
                 first=True, tag_html=tag('10분 전에 시작했어요', filled=False))
    body += (f'<p style="margin: 16px 0 0; font-size: 14px; color: {SUB}">매진된 공연은 상세에서 예매하기 대신 "매진" 표시만 둡니다. '
             f'현장 판매만 하는 공연은 예매하기 버튼을 숨깁니다. 시작한 지 30분이 지나면 목록에서 뺍니다.</p>\n')
    page('StatesBW', '홍대플로우 카드 상태', body)


main(); detail(); calendar(); no_location(); empty(); states()
print('ok')
