// #新規投稿作成画面 タスク詳細
// 1ページ・フォームUIの作成nameの入力欄を用意
// 2フォームの状態管理入力値をstateで管理する
// 3作成APIの呼び出し作成ボタンを押したらPOSTリクエストを送る
// 4完了後の処理成功したら一覧ページへリダイレクト

"use client";

import { useState } from "react";
import { CreateCategoryRequestBody } from "@/app/_types/Posts";
import { useRouter } from "next/navigation";

export default function CreateNewPost() {
  // フォームの入力値（オブジェクト1つ）が入ってくる
  const [form, setForm] = useState<CreateCategoryRequestBody>({
    name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        //失敗したら以下の処理
        setError("送信に失敗しました");
        return;
      }
      router.push("/admin/categories"); //成功したらリダイレクトする
    } catch (e) {
      console.log(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">カテゴリー作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">カテゴリー名</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            type="text"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded self-end"
        >
          作成する
        </button>
      </div>
    </div>
  );
}
