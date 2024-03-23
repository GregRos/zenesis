export function failReason(text: string) {
    return function (target: any) {
        target.failReason = text
    }
}
