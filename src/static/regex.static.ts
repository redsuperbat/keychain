export class RegEx {
  public static email(email: string): boolean {
    if (!email) return false
    const regex = /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/
    return !!email.match(regex)
  }
}
