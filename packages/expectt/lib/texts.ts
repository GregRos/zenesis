export type Txt_Expected = "𝙚𝙭𝙥𝙚𝙘𝙩𝙚𝙙"

export type Txt_Target = "𝙩𝙖𝙧𝙜𝙚𝙩"
export type Txt_Format<Text extends string> = `${Text}`

export type Txt_NotExact = Txt_Format<`𝗵𝗮𝘀 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 𝗺𝗼𝗱𝗶𝗳𝗶𝗲𝗿𝘀 𝗳𝗿𝗼𝗺`>

export type Txt_IsNotAssignableTo = Txt_Format<`𝗶𝘀 𝗻𝗼𝘁 𝗮𝘀𝘀𝗶𝗴𝗻𝗮𝗯𝗹𝗲 𝘁𝗼`>

export type Txt_AreEqual = Txt_Format<`𝗶𝘀 𝗲𝗾𝘂𝗮𝗹 𝘁𝗼`>

export type Txt_AreBothAny = Txt_Format<`𝗮𝗿𝗲 𝗯𝗼𝘁𝗵 𝒂𝒏𝒚`>

export type Txt_IsAssignableTo = Txt_Format<`𝗶𝘀 𝗮𝘀𝘀𝗶𝗴𝗻𝗮𝗯𝗹𝗲 𝘁𝗼`>

export type Txt_IsAssignableFrom = Txt_Format<`𝗶𝘀 𝗮𝘀𝘀𝗶𝗴𝗻𝗮𝗯𝗹𝗲 𝗳𝗿𝗼𝗺`>

export type Txt_IsNotAssignableFrom = Txt_Format<`𝗶𝘀 𝗻𝗼𝘁 𝗮𝘀𝘀𝗶𝗴𝗻𝗮𝗯𝗹𝗲 𝗳𝗿𝗼𝗺`>

export type Txt_IsAnyButNot = Txt_Format<`𝗶𝘀 𝒂𝒏𝒚, 𝘂𝗻𝗹𝗶𝗸𝗲`>

export type Txt_IsNotAnyBut = Txt_Format<`𝗶𝘀 𝗻𝗼𝘁 𝒂𝒏𝒚, 𝘂𝗻𝗹𝗶𝗸𝗲`>
