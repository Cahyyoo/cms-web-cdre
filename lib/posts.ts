import { prisma } from "@/lib/prisma";
import type { CategoryType } from "@prisma/client";

const PAGE_SIZE = 8;

export async function getPostsByType(
  type: CategoryType,
  page: number,
  categoryId?: number
) {
  const where = {
    category: {
      type,
      ...(categoryId ? { id: categoryId } : {}),
    },
  };

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
  };
}
