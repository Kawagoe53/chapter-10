import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { PostsIndexResponse } from "@/app/_types/Posts";

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async () => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得
      orderBy: {
        createdAt: "desc",
      },
    });

    // レスポンスを返す
    return NextResponse.json<PostsIndexResponse>({ posts }, { status: 200 });
    //NextResponse→Next.jsが用意しているレスポンスを返すための専用ツール
  } catch (error) {
    if (error instanceof Error)
      //
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

//APIなので必ずフロントエンドに何かを返さないといけない
//成功した時→データを返す（status: 200）
//失敗した時→エラーを返す（status: 400）
