"use client"

import courses from "@/assets/kdb.json"
import styles from "./page.module.scss"
import { useForm } from "react-hook-form"
import { useState } from "react"

type SearchForm = {
  keyword: string,
  searchOptions: {
    instructionType: {
      "対面": Boolean,
      "対面(オンライン併用型)": Boolean,
      "オンデマンド": Boolean,
    },
    registrationType: {
      "通常科目": Boolean,
      "事前登録科目": Boolean,
    },
  }
}

export default function Home() {

  const { register, handleSubmit, setError } = useForm<SearchForm>()
  // const [showndColumns, setIsShownColumns] = useState({
  //   "科目番号": Boolean,
  //   "科目名": Boolean,
  //   "授業方法": Boolean,
  //   "単位数": Boolean,
  //   "標準履修年次": Boolean,
  //   "実施学期": Boolean,
  //   "教室": Boolean,
  //   "担当教員": Boolean,
  //   "授業概要": Boolean,
  //   "備考": Boolean,
  //   "データ更新日": Boolean,
  // })
  const [searchOptions, setSearchOptions] = useState<{
    instructionType: {
      "対面": Boolean,
      "対面(オンライン併用型)": Boolean,
      "オンデマンド": Boolean,
    },
    registrationType: {
      "通常科目": Boolean,
      "事前登録科目": Boolean,
    },
  }>({
    instructionType: {
      "対面": true,
      "対面(オンライン併用型)": true,
      "オンデマンド": true,
    },
    registrationType: {
      "通常科目": true,
      "事前登録科目": true,
    },
  })
  const [keyword, setKeyword] = useState(/.*/)

  const search = (data: SearchForm) => {
    let re;
    try {
      re = new RegExp(data.keyword)
    } catch (e) {
      setError("keyword", { message: `${e}` })
    }

    if (re) {
      setKeyword(re)
    }

    setSearchOptions(data.searchOptions)
  }

  const result = courses.filter((course) => {

    return course.科目番号 != "" &&
      (keyword.test(course.科目番号) || keyword.test(course.科目名)) &&
      ((searchOptions.instructionType["対面"] && (course.備考.includes("対面")) && !course.備考.includes("対面(オンライン併用型)")) ||
        (searchOptions.instructionType["対面(オンライン併用型)"] && course.備考.includes("対面(オンライン併用型)")) ||
        (searchOptions.instructionType["オンデマンド"] && course.備考.includes("オンデマンド"))) &&
      ((searchOptions.registrationType["通常科目"] && !course.備考.includes("事前登録対象")) ||
        (searchOptions.registrationType["事前登録科目"] && course.備考.includes("事前登録対象")))
  })

  return (
    <div>
      <form onSubmit={handleSubmit(search)}>
        <div>
          <input placeholder="キーワード" {...register("keyword")} />
          <button>検索</button>
          <fieldset>
            <legend>授業方式</legend>

            <span>
              <input
                type="checkbox"
                id="searchOptions.instructionType.対面"
                {...register("searchOptions.instructionType.対面")}
                defaultChecked />
              <label htmlFor="searchOptions.instructionType.対面">対面</label>
            </span>
            <span>
              <input
                type="checkbox"
                id="searchOptions.instructionType.対面(オンライン併用型)"
                {...register("searchOptions.instructionType.対面(オンライン併用型)")}
                defaultChecked />
              <label htmlFor="searchOptions.instructionType.対面(オンライン併用型)">対面(オンライン併用型)</label>
            </span>
            <span>
              <input
                type="checkbox"
                id="searchOptions.instructionType.オンデマンド"
                {...register("searchOptions.instructionType.オンデマンド")}
                defaultChecked />
              <label htmlFor="searchOptions.instructionType.オンデマンド">オンデマンド</label>
            </span>
          </fieldset>
          <fieldset>
            <legend>登録方式</legend>

            <span>
              <input
                type="checkbox"
                id="searchOptions.registrationType.通常科目"
                {...register("searchOptions.registrationType.通常科目")}
                defaultChecked />
              <label htmlFor="searchOptions.registrationType.通常科目">通常科目</label>
            </span>
            <span>
              <input
                type="checkbox"
                id="searchOptions.registrationType.事前登録科目"
                {...register("searchOptions.registrationType.事前登録科目")}
                defaultChecked />
              <label htmlFor="searchOptions.registrationType.事前登録科目">事前登録科目</label>
            </span>
          </fieldset>
        </div>

      </form>

      <p>{result.length}件の検索結果</p>

      <div>
        {
          result.map((course) => (
            <div key={course.科目番号}>
              <span>{course.科目番号}</span>
              <h2>{course.科目名}</h2>
              <div>
                {course.備考.includes("事前登録対象") && <span>事前登録</span>}
                {course.備考.includes("対面") && !course.備考.includes("対面(オンライン併用型)") && <span>対面</span>}
                {course.備考.includes("対面(オンライン併用型)") && <span>対面(オンライン併用型)</span>}
                {course.備考.includes("オンデマンド") && <span>オンデマンド</span>}
              </div>
              <a href={`https://kdb.tsukuba.ac.jp/syllabi/2023/${course.科目番号}/jpn`}>シラバス</a>
            </div>
          ))
        }
      </div>

    </div>
  )
}
