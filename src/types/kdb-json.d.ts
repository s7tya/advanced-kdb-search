declare module "@/assets/kdb.json" {
  type Course = {
    科目番号: string;
    科目名: string;
    授業方法: string;
    単位数: string;
    標準履修年次: string;
    実施学期: string;
    曜時限: string;
    教室: string;
    担当教員: string;
    授業概要: string;
    備考: string;
    データ更新日: string;
  }

  const value: Course[];
  export = value;
}