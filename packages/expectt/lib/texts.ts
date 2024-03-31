export type Txt_Expected = "𝙚𝙭𝙥𝙚𝙘𝙩𝙚𝙙"

export type Txt_Target = "𝙩𝙖𝙧𝙜𝙚𝙩"
export type Txt_FormatError<Text extends string> =
    `                     🔴${Text}🔴`

export type Txt_NotExact<
    Expected extends string,
    Target extends string
> = Txt_FormatError<`${Expected} 𝗶𝘀 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 ${Target}`>
export type _NotAssignable<
    From extends string,
    To extends string
> = Txt_FormatError<`${From} 𝗜𝗦 𝗡𝗢𝗧 𝗔𝗦𝗦𝗜𝗚𝗡𝗔𝗕𝗟𝗘 𝗧𝗢 ${To}`>
export type Txt_AreEqual<
    Expected extends string,
    Target extends string,
    B = any
> = Txt_FormatError<`${Expected} 𝗶𝘀 𝗲𝗾𝘂𝗮𝗹 𝘁𝗼 ${Target}`>

export type Txt_IsAssignable<
    From extends string,
    To extends string
> = Txt_FormatError<`𝗶𝘀 𝗮𝘀𝘀𝗶𝗴𝗻𝗮𝗯𝗹𝗲 𝘁𝗼`>

export type Txt_AnyMismatch<
    IsAny extends string,
    IsNotAny extends string
> = Txt_FormatError<`${IsAny} 𝗶𝘀 𝒂𝒏𝒚 𝗕𝗨𝗧 ${IsNotAny} 𝗶𝘀 𝗻𝗼𝘁`>
