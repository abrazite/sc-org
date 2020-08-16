export class APIUtils {
  static checkStatusOrThrow(res: any): Promise<Object[]> {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((e: Object) => { 
      throw new Error(JSON.stringify(e));
    });
  }
}
