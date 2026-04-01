// #タスク詳細
// 1.既存データの取得・表示カテゴリーIDをもとに現在のnameを
// 取得してフォームに初期表示
// 2.フォームUIの実装入力欄に既存データをセットして編集できる状態にする
// 3.更新APIの呼び出し編集内容をPUTリクエストで送信
// 4.完了後の処理成功したら一覧ページなどにリダイレクト;

"use client";

import {
  UpdateCategoryRequestBody,
  CategoryShowResponse,
} from "@/app/_types/Posts";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FixAdminPost() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); //読み込み中の状態管理
  const router = useRouter();
  const [form, setForm] = useState<UpdateCategoryRequestBody>({
    //これはAPIに送るデータの型
    name: "",
  });

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: CategoryShowResponse = await res.json(); //これはAPIから受け取るデータの型
        setForm({
          //UpdateCategoryRequestBodyはAPIに送るデータの型
          name: data.category.name,
        });
      } catch (e) {
        console.log(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, [id]);

  const updateHandleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError("更新を失敗しました");
        return;
      }
      router.push("/admin/categories"); //成功したらリダイレクトする
    } catch (e) {
      console.log(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

  const deleteHandleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("削除失敗しました");
        return;
      }
      router.push("/admin/categories"); //成功したらリダイレクトする
    } catch (e) {
      console.log(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>ローディング中...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="text-blue-600">
          一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">カテゴリー編集</h1>
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

        <div>
          <button
            onClick={updateHandleSubmit}
            className="bg-green-500 hover:bg-green-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            更新
          </button>

          <button
            onClick={deleteHandleSubmit}
            className="bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
